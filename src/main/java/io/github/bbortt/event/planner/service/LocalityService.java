package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.repository.LocalityRepository;
import java.util.Optional;
import java.util.Set;
import javax.persistence.EntityNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocalityService {

  private static final Logger logger = LoggerFactory.getLogger(LocalityService.class);

  private final PermissionService permissionService;
  private final LocalityRepository localityRepository;

  public LocalityService(PermissionService permissionService, LocalityRepository localityRepository) {
    this.permissionService = permissionService;
    this.localityRepository = localityRepository;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("isAuthenticated()")
  public Set<Locality> findAllInProjectByParentLocality(Optional<Long> optionalProjectId, Optional<Long> parentLocalityId) {
    Long projectId = null;
    Locality parentLocality = null;

    if (optionalProjectId.isPresent()) {
      projectId = optionalProjectId.get();
    }

    if (parentLocalityId.isPresent()) {
      parentLocality = findById(parentLocalityId.get());

      if (projectId != null && !projectId.equals(parentLocality.getProject().getId())) {
        throw new IllegalArgumentException("Something went horribly wrong!");
      }

      projectId = parentLocality.getProject().getId();
    }

    if (projectId == null) {
      throw new IllegalArgumentException("Provide either projectId or parentLocalityId!");
    }

    if (!permissionService.hasProjectPermissions(projectId, "locality:edit")) {
      throw new AccessDeniedException("Access is denied");
    }

    return localityRepository.findAllByProjectIdEqualsAndParentEquals(projectId, parentLocality);
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated() && @permissionService.hasProjectPermissions(#locality.project.id, 'locality:create')")
  public Locality createLocality(Locality locality, Long parentLocalityId) {
    locality.setParent(findById(parentLocalityId));
    return createLocality(locality);
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated() && @permissionService.hasProjectPermissions(#locality.project.id, 'locality:create')")
  public Locality createLocality(Locality locality) {
    logger.info("Create new locality: {}", ReflectionToStringBuilder.toString(locality));

    Locality newLocality = localityRepository.save(locality);
    logger.info("New locality persisted: {}", newLocality);
    return newLocality;
  }

  @Modifying
  @Transactional
  @PreAuthorize("isAuthenticated()")
  public Locality updateLocality(Long id, String name, String description, Long newParentLocalityId) {
    Locality locality = localityRepository
      .findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Locality must have an existing Id!"));

    if (!permissionService.hasProjectPermissions(locality.getProject().getId(), "locality:edit")) {
      throw new AccessDeniedException("Access is denied");
    }

    logger.info("Update locality by id '{}'", id);

    if (StringUtils.isNotEmpty(name)) {
      locality.setName(name);
    }
    if (StringUtils.isNotEmpty(description)) {
      locality.setDescription(description);
    }

    if (Optional.ofNullable(newParentLocalityId).isPresent()) {
      Locality newParent = localityRepository
        .findById(newParentLocalityId)
        .orElseThrow(() -> new IllegalArgumentException("Parent Locality must have an existing Id!"));
      locality.setParent(newParent);
    }

    Locality newLocality = localityRepository.save(locality);
    logger.info("Locality updated: {}", newLocality);
    return newLocality;
  }

  private Locality findById(Long id) {
    return localityRepository
      .findById(id)
      .orElseThrow(() -> new EntityNotFoundException(String.format("Cannot find Locality by id '%s'", id)));
  }
}
