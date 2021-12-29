package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Permission;
import io.github.bbortt.event.planner.repository.PermissionRepository;
import java.util.List;
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
}
