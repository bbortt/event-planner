package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

  private final ProjectRepository projectRepository;

  public ProjectService(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  @PreAuthorize("isAuthenticated()")
  public Page<Project> getProjects(Pageable pageable) {
    String sub = SecurityUtils.getAuth0UserSub().orElseThrow(IllegalAccessError::new);
    return projectRepository.findByAuth0UserIdPaged(sub, pageable);
  }
}
