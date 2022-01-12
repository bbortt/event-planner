package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.repository.LocalityRepository;
import javax.persistence.EntityNotFoundException;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocalityService {

  private static final Logger logger = LoggerFactory.getLogger(LocalityService.class);

  private final PermissionService permissionService;
  private final ProjectService projectService;
  private final LocalityRepository localityRepository;

  public LocalityService(PermissionService permissionService, ProjectService projectService, LocalityRepository localityRepository) {
    this.permissionService = permissionService;
    this.projectService = projectService;
    this.localityRepository = localityRepository;
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated() && @permissionService.hasProjectPermissions(#projectId, 'locality:create')")
  public Locality createLocality(Long projectId, Locality locality, Long parentLocalityId) {
    Locality parentLocality = localityRepository.findById(parentLocalityId).orElseThrow(EntityNotFoundException::new);

    locality.setParent(parentLocality);

    return createLocality(projectId, locality);
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated() && @permissionService.hasProjectPermissions(#projectId, 'locality:create')")
  public Locality createLocality(Long projectId, Locality locality) {
    locality.setProject(projectService.findById(projectId).orElseThrow(IllegalArgumentException::new));

    logger.info("Create new locality: {}", ReflectionToStringBuilder.toString(locality));

    Locality newLocality = localityRepository.save(locality);
    logger.info("New locality persisted: {}", newLocality);
    return newLocality;
  }
}
