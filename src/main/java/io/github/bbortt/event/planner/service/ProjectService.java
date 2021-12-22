package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
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
}
