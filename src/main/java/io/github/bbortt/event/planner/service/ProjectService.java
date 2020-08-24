package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.repository.UserRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.SecurityUtils;
import io.github.bbortt.event.planner.service.dto.CreateProjectDTO;
import io.github.bbortt.event.planner.service.dto.UserDTO;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Project}.
 */
@Service
@Transactional
public class ProjectService {
    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;
    private final InvitationRepository invitationRepository;

    public ProjectService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        ProjectRepository projectRepository,
        InvitationRepository invitationRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.projectRepository = projectRepository;
        this.invitationRepository = invitationRepository;
    }

    /**
     * Save a project.
     *
     * @param project the entity to save.
     * @return the persisted entity.
     */
    public Project save(Project project) {
        log.debug("Request to save Project : {}", project);
        return projectRepository.save(project);
    }

    /**
     * Get all the projects.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Project> findMineOrAll(Pageable pageable, Boolean loadAll) {
        if (loadAll) {
            if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
                throw new IllegalArgumentException("You're not allowed to see all projects!");
            }

            log.debug("Request to get all Projects");
            return projectRepository.findAll(pageable);
        }

        log.debug("Request to get my Projects");
        return projectRepository.findMine(
            SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new IllegalArgumentException("Cannot find current user login!")),
            pageable
        );
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
     * Delete the project by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        projectRepository.deleteById(id);
    }

    /**
     * Create project with properties from DTO.
     *
     * @param createProjectDTO crate project DTO.
     * @return saved project.
     */
    public Project create(CreateProjectDTO createProjectDTO) {
        Project project = new Project()
            .name(createProjectDTO.getName())
            .description(createProjectDTO.getDescription())
            .startTime(createProjectDTO.getStartTime())
            .endTime(createProjectDTO.getEndTime());
        project = projectRepository.save(project);

        User userFromDto = userFromDto(createProjectDTO.getUser());
        Invitation invitation = new Invitation()
            .email(userFromDto.getEmail())
            .user(userFromDto)
            .project(project)
            .role(roleRepository.roleAdmin())
            .accepted(true);
        invitationRepository.save(invitation);

        return projectRepository
            .findById(project.getId())
            .orElseThrow(() -> new IllegalArgumentException("Error while persisting project!"));
    }

    /**
     * Read existing user from {@code UserDTO} or security context.
     *
     * @param userDTO the {@code UserDTO}.
     * @return the creator of the project.
     */
    private User userFromDto(UserDTO userDTO) {
        OptionalUserHolder optionalUserHolder = new OptionalUserHolder();

        Optional<Long> userIdFromDTO = Optional.ofNullable(userDTO.getId());
        userIdFromDTO.ifPresent(userId -> optionalUserHolder.optionalUser = userRepository.findById(userId));

        if (optionalUserHolder.optionalUser.isEmpty()) {
            Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
            currentUserLogin.ifPresent(userLogin -> optionalUserHolder.optionalUser = userRepository.findOneByLogin(userLogin));
        }

        return optionalUserHolder.optionalUser.orElseThrow(() -> new IllegalArgumentException("Cannot assign user! No login available!"));
    }

    private class OptionalUserHolder {
        Optional<User> optionalUser = Optional.empty();

        OptionalUserHolder() {}
    }
}
