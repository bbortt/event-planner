package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.Role;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.SecurityUtils;
import java.util.Arrays;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Role}.
 */
@Service
public class RoleService {
    private final Logger log = LoggerFactory.getLogger(RoleService.class);

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Save a role.
     *
     * @param role the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public Role save(Role role) {
        log.debug("Request to save Role : {}", role);
        return roleRepository.save(role);
    }

    /**
     * Get all the roles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Role> findAll(Pageable pageable) {
        log.debug("Request to get all Roles");
        return roleRepository.findAll(pageable);
    }

    /**
     * Get one role by id.
     *
     * @param name the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Role> findOne(String name) {
        log.debug("Request to get Role : {}", name);
        return roleRepository.findById(name);
    }

    /**
     * Delete the role by id.
     *
     * @param name the id of the entity.
     */
    @Transactional
    public void delete(String name) {
        log.debug("Request to delete Role : {}", name);
        roleRepository.deleteById(name);
    }

    @Transactional(readOnly = true)
    public boolean hasAnyRoleInProject(Project project, String... roles) {
        return (
            SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN) ||
            roleRepository.hasAnyRoleInProject(
                project,
                SecurityUtils.getCurrentUserLogin().orElseThrow(IllegalArgumentException::new),
                Arrays.asList(roles)
            )
        );
    }
}
