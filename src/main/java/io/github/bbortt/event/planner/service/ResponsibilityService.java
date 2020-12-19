package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.repository.ResponsibilityRepository;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.SecurityUtils;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Responsibility}.
 */
@Service
@Transactional
public class ResponsibilityService {

    private final Logger log = LoggerFactory.getLogger(ResponsibilityService.class);

    private final ResponsibilityRepository responsibilityRepository;
    private final RoleRepository roleRepository;

    public ResponsibilityService(ResponsibilityRepository responsibilityRepository, RoleRepository roleRepository) {
        this.responsibilityRepository = responsibilityRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Save a responsibility.
     *
     * @param responsibility the entity to save.
     * @return the persisted entity.
     */
    public Responsibility save(Responsibility responsibility) {
        log.debug("Request to save Responsibility : {}", responsibility);
        return responsibilityRepository.save(responsibility);
    }

    /**
     * Get all the responsibilities.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Responsibility> findAll(Pageable pageable) {
        log.debug("Request to get all Responsibilities");
        return responsibilityRepository.findAll(pageable);
    }

    /**
     * Get one responsibility by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Responsibility> findOne(Long id) {
        log.debug("Request to get Responsibility : {}", id);
        return responsibilityRepository.findById(id);
    }

    /**
     * Delete the responsibility by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Responsibility : {}", id);
        responsibilityRepository.deleteById(id);
    }

    /**
     * Find all Responsibilities for the given Project.
     *
     * @param projectId the id of the project to retrieve responsibilities for.
     * @return the list of entities.
     */
    public List<Responsibility> findAllByProjectId(Long projectId) {
        log.debug("Request to get all Responsibilities for Project {}", projectId);
        return responsibilityRepository.findAllByProjectId(projectId);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Responsibility`,
     * identified by id. The project access must be given by any of the `roles`. Example usage:
     * `@PreAuthorize("@responsibilityService.hasAccessToResponsibility(#responsibility, 'ADMIN',
     * 'SECRETARY')")`
     *
     * @param responsibilityId the id of the responsibility with a linked project to check.
     * @param roles            to look out for.
     * @return true if the project access has any of the roles.
     */
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToResponsibility(Long responsibilityId, String... roles) {
        Optional<Responsibility> responsibility = findOne(responsibilityId);
        return responsibility.map(value -> hasAccessToResponsibility(value, roles)).orElse(true);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Responsibility`.
     * The project access must be given by any of the `roles`. Example usage:
     * `@PreAuthorize("@responsibilityService.hasAccessToResponsibility(#responsibility, 'ADMIN',
     * 'SECRETARY')")`
     *
     * @param responsibility the entity with a linked project to check.
     * @param roles          to look out for.
     * @return true if the project access has any of the roles.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToResponsibility(Responsibility responsibility, String... roles) {
        return (
            SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN) ||
            roleRepository.hasAnyRoleInProject(
                responsibility.getProject(),
                SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new IllegalArgumentException("No user Login found!")),
                Arrays.asList(roles)
            )
        );
    }
}
