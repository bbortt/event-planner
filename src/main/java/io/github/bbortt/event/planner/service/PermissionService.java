package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Permission;
import io.github.bbortt.event.planner.repository.PermissionRepository;
import io.github.bbortt.event.planner.security.SecurityUtils;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {

  private static final Logger logger = LoggerFactory.getLogger(PermissionService.class);

  private final PermissionRepository permissionRepository;

  public PermissionService(PermissionRepository permissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  List<Permission> findAll() {
    logger.info("Find all permissions");
    return permissionRepository.findAll();
  }

  public Boolean hasProjectPermissions(Long projectId, String... permissions) {
    Optional<String> auth0UserSub = SecurityUtils.getAuth0UserSub();
    if (auth0UserSub.isEmpty()) {
      return Boolean.FALSE;
    }

    return permissionRepository.auth0UserHasProjectPermission(auth0UserSub.get(), projectId, Arrays.asList(permissions));
  }
}
