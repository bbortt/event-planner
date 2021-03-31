package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.client.UserServiceFeignClient;
import io.github.bbortt.event.planner.backend.config.Constants;
import io.github.bbortt.event.planner.backend.security.SecurityUtils;
import io.github.bbortt.event.planner.backend.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserServiceFeignClient userService;

    public UserService(UserServiceFeignClient userService) {
        this.userService = userService;
    }

    /**
     * Return the current user information, if any.
     * @return the current user information
     */
    @PreAuthorize("isAuthenticated()")
    public AdminUserDTO getCurrentUser() {
        log.debug("Request to get current user information");
        return SecurityUtils
            .getCurrentAuthenticationToken()
            .filter(authenticationToken -> AbstractAuthenticationToken.class.isAssignableFrom(authenticationToken.getClass()))
            .map(authenticationMono -> ((AbstractAuthenticationToken) authenticationMono))
            .map(this::getUserFromAuthentication)
            .orElseThrow(IllegalArgumentException::new);
    }

    /**
     * Returns the user from an OAuth 2.0 login or resource server with JWT.
     *
     * @param authToken the authentication token.
     * @return the user from the authentication.
     */
    private AdminUserDTO getUserFromAuthentication(AbstractAuthenticationToken authToken) {
        Map<String, Object> attributes;
        if (authToken instanceof OAuth2AuthenticationToken) {
            attributes = ((OAuth2AuthenticationToken) authToken).getPrincipal().getAttributes();
        } else if (authToken instanceof JwtAuthenticationToken) {
            attributes = ((JwtAuthenticationToken) authToken).getTokenAttributes();
        } else {
            throw new IllegalArgumentException("AuthenticationToken is not OAuth2 or JWT!");
        }
        AdminUserDTO user = getUser(attributes);
        user.setAuthorities(authToken.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet()));
        return user;
    }

    private static AdminUserDTO getUser(Map<String, Object> details) {
        AdminUserDTO user = new AdminUserDTO();
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

    public AdminUserDTO findUserByLogin(String login) {
        return userService.findUserByLogin(login).orElseThrow(EntityNotFoundException::new);
    }
}
