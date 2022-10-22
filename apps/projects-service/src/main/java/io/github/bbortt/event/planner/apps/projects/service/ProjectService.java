package io.github.bbortt.event.planner.apps.projects.service;

import io.github.bbortt.event.planner.apps.projects.domain.Member;
import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.domain.repository.ProjectJpaRepository;
import io.github.bbortt.event.planner.apps.projects.security.SecurityUtils;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Lazy
@Service
public class ProjectService {

  private static final String PROJECT_ID_ATTRIBUTE_NAME = "id";

  private final PermissionService permissionService;
  private final ProjectJpaRepository projectRepository;

  private final PaginationUtils paginationUtils = new PaginationUtils();

  public ProjectService(PermissionService permissionService, ProjectJpaRepository projectRepository) {
    this.permissionService = permissionService;
    this.projectRepository = projectRepository;
  }

  @Transactional
  @PreAuthorize("isAuthenticated()")
  public Project createProject(Project project) {
    if (!Objects.isNull(project.getId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New project cannot have an Id!");
    }

    if (project.getStartDate().isAfter(project.getEndDate())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project cannot end before it starts!");
    }

    String sub = SecurityUtils.getAuth0UserSub().orElseThrow(IllegalAccessError::new);

    Member rootMember = new Member(project, sub);
    rootMember.setPermissions(new HashSet<>(permissionService.findAll()));
    rootMember.setAccepted(SecurityUtils.getAuth0UserSub().orElseThrow(IllegalAccessError::new));

    project.getMembers().add(rootMember);

    return projectRepository.saveAndFlush(project);
  }

  @Modifying
  @Transactional
  @PreAuthorize("#permissionService.hasProjectPermissions(#id, 'project:update')")
  public Project updateProject(Long id, String name, String description, Boolean archived) {
    Project project = projectRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project must have an existing Id!"));

    if (StringUtils.isNotEmpty(name)) {
      project.setName(name);
    }
    if (StringUtils.isNotEmpty(description)) {
      project.setDescription(description);
    }
    if (!Objects.isNull(archived)) {
      project.setArchived(archived);
    }

    return projectRepository.save(project);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("@projectRepository.isMemberOfProject(#projectId)")
  public Project findById(Long projectId) {
    return projectRepository
      .findById(projectId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT, String.format("Cannot find Project by id '%s'", projectId)));
  }

  @Transactional(readOnly = true)
  @PreAuthorize("isAuthenticated()")
  public Page<Project> findAllNonArchivedProjectsWhichIAmMemberOf(
    Optional<Integer> pageSize,
    Optional<Integer> pageNumber,
    Optional<String> sort
  ) {
    String sub = SecurityUtils.getAuth0UserSub().orElseThrow(IllegalAccessError::new);

    return projectRepository.findAllByMemberAndArchivedIsFalse(
      sub,
      paginationUtils.createPagingInformation(pageSize, pageNumber, sort, PROJECT_ID_ATTRIBUTE_NAME)
    );
  }
}
