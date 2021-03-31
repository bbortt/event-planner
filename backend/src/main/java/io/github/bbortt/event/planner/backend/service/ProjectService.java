package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.repository.InvitationRepository;
import io.github.bbortt.event.planner.backend.repository.ProjectRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.security.SecurityUtils;
import io.github.bbortt.event.planner.backend.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.backend.service.dto.CreateProjectDTO;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.backend.service.exception.ForbiddenRequestException;
import io.github.bbortt.event.planner.backend.service.exception.IdMustBePresentException;
import io.github.bbortt.event.planner.backend.service.mapper.ProjectMapper;
import java.util.Collections;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zalando.problem.Status;
import org.zalando.problem.violations.ConstraintViolationProblem;
import org.zalando.problem.violations.Violation;

/**
 * Service Implementation for managing {@link Project}.
 */
@Service
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectMapper projectMapper = new ProjectMapper();

    private final RoleService roleService;

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;
    private final InvitationRepository invitationRepository;

    public ProjectService(
        UserService userService,
        RoleService roleService,
        RoleRepository roleRepository,
        ProjectRepository projectRepository,
        InvitationRepository invitationRepository
    ) {
        this.userService = userService;
        this.roleService = roleService;
        this.roleRepository = roleRepository;
        this.projectRepository = projectRepository;
        this.invitationRepository = invitationRepository;
    }

    /**
     * Create project with properties from DTO.
     *
     * @param createProjectDTO crate project DTO.
     * @return saved project.
     */
    @Transactional
    public Project create(CreateProjectDTO createProjectDTO) {
        Project project = projectMapper.createProjectDTOToProject(createProjectDTO);

        if (project.getStartTime().isAfter(project.getEndTime())) {
            throw new ConstraintViolationProblem(
                Status.BAD_REQUEST,
                Collections.singletonList(new Violation("endTime", "endTime may not occur before startTime!"))
            );
        }

        project = projectRepository.save(project);

        AdminUserDTO userInformation = Optional.ofNullable(createProjectDTO.getUserInformation()).orElseGet(userService::getCurrentUser);

        Invitation invitation = new Invitation()
            .jhiUserId(userInformation.getId())
            .email(userInformation.getEmail())
            .project(project)
            .role(roleRepository.roleAdmin())
            .accepted(true);
        invitationRepository.save(invitation);

        return projectRepository
            .findById(project.getId())
            .orElseThrow(() -> new IllegalArgumentException("Error while persisting project!"));
    }

    /**
     * Save a project.
     *
     * @param project the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public Project save(Project project) {
        log.debug("Request to save Project : {}", project);
        return projectRepository.save(project);
    }

    /**
     * Get all the projects which are not archived.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public Page<Project> findMineOrAllByArchived(boolean all, boolean archived, Pageable pageable) {
        if (all) {
            if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
                throw new ForbiddenRequestException("You're not allowed to see all projects!");
            }

            log.debug("Request to get all Projects: { archived: {} }", archived);
            return projectRepository.findAllByArchived(archived, pageable);
        }

        String jhiUserId = userService.getCurrentUser().getId();
        log.debug("Request to get Projects for user {}", jhiUserId);

        return projectRepository.findMineByArchived(jhiUserId, archived, pageable);
    }

    /**
     * Get one project by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Project> findOne(Long id) {
        log.debug("Request to get Project : {}", id);
        return projectRepository.findById(id);
    }

    /**
     * Get project name by id.
     *
     * @param id the id of the entity.
     * @return name of the entity.
     */
    @Transactional(readOnly = true)
    public Optional<String> findNameByProjectId(Long id) {
        log.debug("Request to get name of Project : {}", id);
        return projectRepository.findNameByProjectId(id);
    }

    /**
     * Delete the project by id.
     *
     * @param id the id of the entity.
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        projectRepository.deleteById(id);
    }

    /**
     * Archive the project by id.
     *
     * @param id the id of the entity.
     */
    @Transactional
    public void archive(Long id) {
        log.debug("Request to archive Project : {}", id);
        if (projectRepository.archive(id) == 0) {
            throw new IllegalArgumentException("Unable to archive Project!");
        }
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToProject(Project project, String... roles) {
        return hasAccessToProject(project.getId(), roles);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToProject(Long projectId, String... roles) {
        if (projectId == null) {
            throw new IdMustBePresentException();
        }

        return roleService.hasAnyRoleInProject(projectRepository.findById(projectId).orElseThrow(EntityNotFoundException::new), roles);
    }
}
