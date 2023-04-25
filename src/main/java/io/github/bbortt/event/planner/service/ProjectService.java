package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.service.mapper.ProjectMapper;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Project}.
 */
@Service
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRepository projectRepository;

    private final ProjectMapper projectMapper;

    public ProjectService(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    /**
     * Save a project.
     *
     * @param projectDTO the entity to save.
     * @return the persisted entity.
     */
    @Modifying
    @Transactional
    public ProjectDTO save(ProjectDTO projectDTO) {
        log.debug("Request to save Project : {}", projectDTO);
        Project project = projectMapper.toEntity(projectDTO);

        // Sanitize new project
        project.token(UUID.randomUUID()).archived(Boolean.FALSE);

        return projectMapper.toDto(projectRepository.save(project));
    }

    /**
     * Update a project.
     *
     * @param projectDTO the entity to save.
     * @return the persisted entity.
     */
    @Modifying
    @Transactional
    public ProjectDTO update(ProjectDTO projectDTO) {
        log.debug("Request to update Project : {}", projectDTO);
        Project project = projectMapper.toEntity(projectDTO);
        project = projectRepository.save(project);
        return projectMapper.toDto(project);
    }

    /**
     * Partially update a project.
     *
     * @param projectDTO the entity to update partially.
     * @return the persisted entity.
     */
    @Modifying
    @Transactional
    public Optional<ProjectDTO> partialUpdate(ProjectDTO projectDTO) {
        log.debug("Request to partially update Project : {}", projectDTO);

        return projectRepository
            .findById(projectDTO.getId())
            .map(existingProject -> {
                projectMapper.partialUpdate(existingProject, projectDTO);

                return existingProject;
            })
            .map(projectRepository::save)
            .map(projectMapper::toDto);
    }

    /**
     * Check if specific project by id exists.
     *
     * @param projectId the id of the entity.
     * @return true if the project exists, false otherwise.
     */
    @Transactional(readOnly = true)
    public boolean exists(Long projectId) {
        log.debug("Request to check if Project with id '{}' exists", projectId);
        return projectRepository.existsById(projectId);
    }

    /**
     * Get all the projects.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProjectDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Projects");
        return projectRepository.findAll(pageable).map(projectMapper::toDto);
    }

    /**
     * Get one project by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProjectDTO> findOne(Long id) {
        log.debug("Request to get Project : {}", id);
        return projectRepository.findById(id).map(projectMapper::toDto);
    }

    /**
     * Get one project by id.
     *
     * @param token the token of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProjectDTO> findOneByToken(String token) {
        log.debug("Request to get Project by token: {}", token);
        return projectRepository.findByToken(UUID.fromString(token)).map(projectMapper::toDto);
    }

    /**
     * Find all projects in which the current user takes part in.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("T(io.github.bbortt.event.planner.security.SecurityUtils).isAuthenticated()")
    public Slice<ProjectDTO> findAllNotArchivedForCurrentUser(Pageable pageable) {
        log.debug("Request to get all Projects for current user");
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new IllegalArgumentException("Cannot find current user!"));

        if (log.isTraceEnabled()) {
            log.trace("Current login is '{}'", login);
        }

        return projectRepository.findAllByCreatedByEqualsAndArchivedIsFalse(login, pageable).map(projectMapper::toDto);
    }

    /**
     * Delete the project by id.
     *
     * @param id the id of the entity.
     */
    @Modifying
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        projectRepository.deleteById(id);
    }
}
