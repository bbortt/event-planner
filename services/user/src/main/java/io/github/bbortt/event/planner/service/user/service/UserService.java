package io.github.bbortt.event.planner.service.user.service;

import io.github.bbortt.event.planner.service.user.config.Constants;
import io.github.bbortt.event.planner.service.user.domain.Authority;
import io.github.bbortt.event.planner.service.user.domain.User;
import io.github.bbortt.event.planner.service.user.repository.AuthorityRepository;
import io.github.bbortt.event.planner.service.user.repository.UserRepository;
import io.github.bbortt.event.planner.service.user.security.SecurityUtils;
import io.github.bbortt.event.planner.service.user.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.service.user.service.dto.UserDTO;
import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final AuthorityRepository authorityRepository;

    public UserService(UserRepository userRepository, AuthorityRepository authorityRepository) {
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
    }

    @Transactional(readOnly = true)
    public Optional<AdminUserDTO> findOne(String jhiUserId) {
        return userRepository.findById(jhiUserId)
            .map(AdminUserDTO::new);
    }

    @Transactional
    public void syncUser(User user) {
        syncUserWithIdP(new HashMap<>(), user);
    }

    private User syncUserWithIdP(Map<String, Object> details, User user) {
        // save authorities in to sync user roles/groups between IdP and JHipster's local database
        Collection<String> dbAuthorities = getAuthorities();
        Collection<String> userAuthorities = user.getAuthorities().stream().map(Authority::getName).collect(Collectors.toList());
        for (String authority : userAuthorities) {
            if (!dbAuthorities.contains(authority)) {
                log.debug("Saving authority '{}' in local database", authority);
                Authority authorityToSave = new Authority();
                authorityToSave.setName(authority);
                authorityRepository.save(authorityToSave);
            }
        }
        // save account in to sync users between IdP and JHipster's local database
        Optional<User> existingUser = userRepository.findOneByLogin(user.getLogin());
        if (existingUser.isPresent()) {
            // if IdP sends last updated information, use it to determine if an update should happen
            if (details.get("updated_at") != null) {
                Instant dbModifiedDate = existingUser.get().getLastModifiedDate();
                Instant idpModifiedDate = (Instant) details.get("updated_at");
                if (idpModifiedDate.isAfter(dbModifiedDate)) {
                    log.debug("Updating user '{}' in local database", user.getLogin());
                    updateUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getLangKey(), user.getImageUrl());
                }
                // no last updated info, blindly update
            } else {
                log.debug("Updating user '{}' in local database", user.getLogin());
                updateUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getLangKey(), user.getImageUrl());
            }
        } else {
            log.debug("Saving user '{}' in local database", user.getLogin());
            userRepository.save(user);
        }
        return user;
    }

    private List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    private void updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        SecurityUtils
            .getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(
                user -> {
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    if (email != null) {
                        user.setEmail(email.toLowerCase());
                    }
                    user.setLangKey(langKey);
                    user.setImageUrl(imageUrl);
                    log.debug("Changed Information for User: {}", user);
                }
            );
    }

    /**
     * Returns the user from an OAuth 2.0 login or resource server with JWT. Synchronizes the user in the local repository.
     *
     * @param authToken the authentication token.
     * @return the user from the authentication.
     */
    AdminUserDTO getUserFromAuthentication(AbstractAuthenticationToken authToken) {
        Map<String, Object> attributes;
        if (authToken instanceof OAuth2AuthenticationToken) {
            attributes = ((OAuth2AuthenticationToken) authToken).getPrincipal().getAttributes();
        } else if (authToken instanceof JwtAuthenticationToken) {
            attributes = ((JwtAuthenticationToken) authToken).getTokenAttributes();
        } else {
            throw new IllegalArgumentException("AuthenticationToken is not OAuth2 or JWT!");
        }
        User user = getUser(attributes);
        user.setAuthorities(
            authToken
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .map(
                    authority -> {
                        Authority auth = new Authority();
                        auth.setName(authority);
                        return auth;
                    }
                )
                .collect(Collectors.toSet())
        );
        return new AdminUserDTO(syncUserWithIdP(attributes, user));
    }

    private User getUser(Map<String, Object> details) {
        User user = new User();
        Boolean activated = Boolean.TRUE;
        // handle resource server JWT, where sub claim is email and uid is ID
        if (details.get("uid") != null) {
            user.setId((String) details.get("uid"));
            user.setLogin((String) details.get("sub"));
        } else {
            user.setId((String) details.get("sub"));
        }
        if (details.get("preferred_username") != null) {
            user.setLogin(((String) details.get("preferred_username")).toLowerCase());
        } else if (user.getLogin() == null) {
            user.setLogin(user.getId());
        }
        if (details.get("given_name") != null) {
            user.setFirstName((String) details.get("given_name"));
        }
        if (details.get("family_name") != null) {
            user.setLastName((String) details.get("family_name"));
        }
        if (details.get("email_verified") != null) {
            activated = (Boolean) details.get("email_verified");
        }
        if (details.get("email") != null) {
            user.setEmail(((String) details.get("email")).toLowerCase());
        } else {
            user.setEmail((String) details.get("sub"));
        }
        if (details.get("langKey") != null) {
            user.setLangKey((String) details.get("langKey"));
        } else if (details.get("locale") != null) {
            // trim off country code if it exists
            String locale = (String) details.get("locale");
            if (locale.contains("_")) {
                locale = locale.substring(0, locale.indexOf('_'));
            } else if (locale.contains("-")) {
                locale = locale.substring(0, locale.indexOf('-'));
            }
            user.setLangKey(locale.toLowerCase());
        } else {
            // set langKey to default if not specified by IdP
            user.setLangKey(Constants.DEFAULT_LANGUAGE);
        }
        if (details.get("picture") != null) {
            user.setImageUrl((String) details.get("picture"));
        }
        user.setActivated(activated);
        return user;
    }

    /**
     * Find possible User by email or login containing.
     *
     * @param emailOrLogin partial email or login.
     * @return list of possible Users.
     */
    @Transactional(readOnly = true)
    public List<UserDTO> findByEmailOrLoginContaining(String emailOrLogin) {
        log.debug("Request to get all Users by login or email: {}", emailOrLogin);
        return userRepository
            .findTop5ByEmailContainingIgnoreCaseOrLoginContainingIgnoreCase(emailOrLogin, emailOrLogin)
            .stream()
            .map(UserDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<AdminUserDTO> findOneByLogin(String login) {
        return userRepository.findOneByLogin(login)
            .map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public List<AdminUserDTO> findAllById(List<String> jhiUserIds) {
        return userRepository.findAllById(jhiUserIds)
            .stream().map(AdminUserDTO::new)
            .collect(Collectors.toList());
    }
}
