package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

  private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

  private final Auth0UserService userService;
  private final PermissionService permissionService;

  private final ProjectRepository projectRepository;

  public ProjectService(Auth0UserService userService, PermissionService permissionService, ProjectRepository projectRepository) {
    this.userService = userService;
    this.permissionService = permissionService;

    this.projectRepository = projectRepository;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("isAuthenticated()")
  public Optional<Project> findById(Long projectId) {
    return projectRepository.findById(projectId);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("isAuthenticated()")
  public Page<Project> findAll(Pageable pageable) {
    String sub = SecurityUtils.getAuth0UserSub().orElseThrow(IllegalAccessError::new);

    logger.info("List projects for user '{}'", sub);

    return projectRepository.findByAuth0UserIdPaged(sub, pageable);
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated()")
  public Project createProject(Project project) {
    if (!Objects.isNull(project.getId())) {
      throw new IllegalArgumentException("New project cannot have an Id!");
    }

    if (project.getStartDate().isAfter(project.getEndDate())) {
      throw new IllegalArgumentException("Project cannot end before it starts!");
    }

    logger.info("Create new project: {}", project);

    Member rootMember = new Member(project, userService.currentUser().orElseThrow(IllegalAccessError::new));
    rootMember.setPermissions(new HashSet<>(permissionService.findAll()));
    rootMember.setAccepted(SecurityUtils.getAuth0UserSub().orElseThrow(IllegalAccessError::new));

    project.getMembers().add(rootMember);

    Project newProject = projectRepository.save(project);
    logger.debug("New project persisted: {}", newProject);
    return newProject;
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated()")
  public Project updateProject(Long id, String name, String description, Boolean archived) {
    Project project = projectRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Project must have an existing Id!"));

    logger.info("Update project by id '{}'", id);

    if (StringUtils.isNotEmpty(name)) {
      project.setName(name);
    }
    if (StringUtils.isNotEmpty(description)) {
      project.setDescription(description);
    }
    if (!Objects.isNull(archived)) {
      project.setArchived(archived);
    }

    Project updatedProject = projectRepository.save(project);
    logger.debug("Project updated: {}", updatedProject);
    return updatedProject;
  }
}
