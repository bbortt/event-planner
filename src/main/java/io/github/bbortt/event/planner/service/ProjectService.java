package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import java.util.Objects;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

  private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

  private final ProjectRepository projectRepository;

  public ProjectService(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("isAuthenticated()")
  public Page<Project> getProjects(Pageable pageable) {
    String sub = SecurityUtils.getAuth0UserSub().orElseThrow(IllegalAccessError::new);

    logger.debug("Requesting projects for user '{}'", sub);

    return projectRepository.findByAuth0UserIdPaged(sub, pageable);
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated()")
  public Project createProject(Project project) {
    if (!Objects.isNull(project.getId())) {
      throw new IllegalArgumentException("New project cannot have an ID!");
    }

    if (project.getStartTime().isAfter(project.getEndTime())) {
      throw new IllegalArgumentException("Project cannot end before it starts!");
    }

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return projectRepository.save(project);
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated()")
  public Project updateProject(Long id, String name, String description, Boolean archived) {
    Project project = projectRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Project must have an existing ID!"));

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
}
