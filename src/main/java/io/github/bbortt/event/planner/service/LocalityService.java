package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.repository.LocalityRepository;
import javax.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocalityService {

  private final PermissionService permissionService;
  private final ProjectService projectService;
  private final LocalityRepository localityRepository;

  public LocalityService(PermissionService permissionService, ProjectService projectService, LocalityRepository localityRepository) {
    this.permissionService = permissionService;
    this.projectService = projectService;
    this.localityRepository = localityRepository;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("isAuthenticated() && @permissionService.hasProjectPermission(#projectId, 'locality:create')")
  public Locality createLocality(Long projectId, Locality locality, Long parentLocalityId) {
    Locality parentLocality = localityRepository.findById(parentLocalityId).orElseThrow(EntityNotFoundException::new);

    locality.setParent(parentLocality);

    return createLocality(projectId, locality);
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated() && @permissionService.hasProjectPermission(#projectId, 'locality:create')")
  public Locality createLocality(Long projectId, Locality locality) {
    locality.setProject(projectService.findById(projectId).orElseThrow(IllegalArgumentException::new));
    return localityRepository.save(locality);
  }
}
