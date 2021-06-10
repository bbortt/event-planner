package io.github.bbortt.event.planner.service.user.web.rest;

import io.github.bbortt.event.planner.service.user.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.service.user.service.UserService;
import io.github.bbortt.event.planner.service.user.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.service.user.service.dto.UserDTO;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing users.
 * <p>
 * This class accesses the {@link io.github.bbortt.event.planner.service.user.domain.User} entity, and needs to fetch its collection of authorities.
 * <p>
 * For a normal use-case, it would be better to have an eager relationship between User and Authority, and send everything to the client side: there would be no View Model and DTO, a lot less code, and an outer-join which would be good for performance.
 * <p>
 * We use a View Model and a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities, because people will
 * quite often do relationships with the user, and we don't want them to get the authorities all
 * the time for nothing (for performance reasons). This is the #1 goal: we should not impact our users'
 * application because of this use-case.</li>
 * <li> Not having an outer join causes n+1 requests to the database. This is not a real issue as
 * we have by default a second-level cache. This means on the first HTTP call we do the n+1 requests,
 * but then all authorities come from the cache, so in fact it's much better than doing an outer join
 * (which will get lots of data from the database, for each HTTP call).</li>
 * <li> As this manages users, for security reasons, we'd rather have a DTO layer.</li>
 * </ul>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this case.
 */
@RestController
@RequestMapping("/api")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);
    private final UserService userService;
    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AdminUserDTO>> getUsers(@RequestParam("ids") List<String> jhiUserIds) {
        log.debug("REST request to get Usesr by id: {}", jhiUserIds);
        List<AdminUserDTO> users = userService.findAllById(jhiUserIds);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{jhiUserId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AdminUserDTO> getUser(@PathVariable String jhiUserId) {
        log.debug("REST request to get User by login: {}", jhiUserId);
        Optional<AdminUserDTO> user = userService.findOne(jhiUserId);
        return ResponseUtil.wrapOrNotFound(user);
    }

    @GetMapping("/users/findByLogin/{login}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AdminUserDTO> findByLogin(@PathVariable String login) {
        log.debug("REST request to get User by login: {}", login);
        Optional<AdminUserDTO> user = userService.findOneByLogin(login);
        return ResponseUtil.wrapOrNotFound(user);
    }

    /**
     * {@code POST /users/findByEmailOrLogin} : find possible User by login or email.
     *
     * @param emailOrLogin partial email or login.
     * @return list of possible User.
     */
    @GetMapping("/users/findByEmailOrLogin/{emailOrLogin}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<UserDTO>> findByEmailOrLogin(@PathVariable String emailOrLogin) {
        log.debug("REST request to search User by email or login: {}", emailOrLogin);
        return ResponseEntity.ok(userService.findByEmailOrLoginContaining(emailOrLogin));
    }
}
