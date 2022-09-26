package io.github.bbortt.event.planner.apps.projects.service;

import io.github.bbortt.event.planner.apps.projects.domain.Permission;
import io.github.bbortt.event.planner.apps.projects.domain.repository.PermissionJpaRepository;
import io.github.bbortt.event.planner.apps.projects.security.SecurityUtils;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Lazy
@Service
public class PermissionService {

  private final PermissionJpaRepository permissionRepository;

  public PermissionService(PermissionJpaRepository permissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  List<Permission> findAll() {
    return permissionRepository.findAll();
  }

  public Boolean hasProjectPermissions(Long projectId, String... permissions) {
    Optional<String> auth0UserSub = SecurityUtils.getAuth0UserSub();
    if (auth0UserSub.isEmpty()) {
      return Boolean.FALSE;
    }

    return permissionRepository.memberHasAllOfPermissionsInProject(auth0UserSub.get(), projectId, Arrays.asList(permissions));
  }
}
