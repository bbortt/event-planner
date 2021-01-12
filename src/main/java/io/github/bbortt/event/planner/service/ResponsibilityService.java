package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.repository.ResponsibilityRepository;
import io.github.bbortt.event.planner.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.service.exception.IdMustBePresentException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Responsibility}.
 */
@Service
public class ResponsibilityService {

    private final Logger log = LoggerFactory.getLogger(ResponsibilityService.class);

    private final ProjectService projectService;

    private final ResponsibilityRepository responsibilityRepository;

    public ResponsibilityService(ProjectService projectService, ResponsibilityRepository responsibilityRepository) {
        this.projectService = projectService;
        this.responsibilityRepository = responsibilityRepository;
    }

    /**
     * Save a responsibility.
     *
     * @param responsibility the entity to save.
     * @return the persisted entity.
     */
    @Transactional
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
     * Get responsibility name by id.
     *
     * @param id the id of the entity.
     * @return name of the entity.
     */
    @Transactional(readOnly = true)
    public Optional<String> findNameByResponsibilityId(Long id) {
        log.debug("Request to get name of Responsibility : {}", id);
        return responsibilityRepository.findNameByResponsibilityId(id);
    }

    /**
     * Delete the responsibility by id.
     *
     * @param id the id of the entity.
     */
    @Transactional
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
    @Transactional(readOnly = true)
    public List<Responsibility> findAllByProjectId(Long projectId, Sort sort) {
        log.debug("Request to get all Responsibilities for Project {}", projectId);
        return responsibilityRepository.findAllByProjectId(
            projectId,
            Sort.by(sort.stream().map(Order::ignoreCase).collect(Collectors.toList()))
        );
    }

    /**
     * Checks whether the given name is still unique in this Project.
     *
     * @param projectId the Project identifier.
     * @param name the value to check.
     * @return true if the value exists.
     */
    @Transactional(readOnly = true)
    public Boolean isNameExistingInProject(Long projectId, String name) {
        log.debug("Request to check uniqueness of name '{}' by projectId : {}", name, projectId);
        return responsibilityRepository.findOneByNameAndProjectId(name, projectId).isPresent();
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Responsibility`, identified by id. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@responsibilityService.hasAccessToResponsibility(#responsibility, 'ADMIN', 'SECRETARY')")`
     *
     * @param responsibilityId the id of the responsibility with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToResponsibility(Long responsibilityId, String... roles) {
        if (responsibilityId == null) {
            throw new IdMustBePresentException();
        }

        Responsibility responsibility = findOne(responsibilityId).orElseThrow(EntityNotFoundException::new);
        return hasAccessToResponsibility(responsibility, roles);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Responsibility`. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@responsibilityService.hasAccessToResponsibility(#responsibility, 'ADMIN', 'SECRETARY')")`
     *
     * @param responsibility the entity with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToResponsibility(Responsibility responsibility, String... roles) {
        return projectService.hasAccessToProject(responsibility.getProject(), roles);
    }
}
