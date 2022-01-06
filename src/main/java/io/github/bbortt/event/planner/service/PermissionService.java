package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Permission;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.PermissionRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {

  private static final Logger logger = LoggerFactory.getLogger(PermissionService.class);

  private final ProjectService projectService;
  private final PermissionRepository permissionRepository;

  public PermissionService(ProjectService projectService, PermissionRepository permissionRepository) {
    this.projectService = projectService;
    this.permissionRepository = permissionRepository;
  }

  List<Permission> findAll() {
    logger.info("Find all permissions");
    return permissionRepository.findAll();
  }

  Boolean hasProjectPermissions(Long projectId, String... permissions) {
    Optional<String> auth0UserSub = SecurityUtils.getAuth0UserSub();
    if (auth0UserSub.isEmpty()) {
      return Boolean.FALSE;
    }

    Optional<Project> project = projectService.findById(projectId);
    if (project.isEmpty()) {
      return Boolean.FALSE;
    }

    return Boolean.TRUE;
  }
}
