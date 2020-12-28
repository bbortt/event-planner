package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.repository.SectionRepository;
import io.github.bbortt.event.planner.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.service.exception.IdMustBePresentException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Location}.
 */
@Service
public class LocationService {

    private final Logger log = LoggerFactory.getLogger(LocationService.class);

    private final ProjectService projectService;

    private final LocationRepository locationRepository;
    private final SectionRepository sectionRepository;

    public LocationService(ProjectService projectService, LocationRepository locationRepository, SectionRepository sectionRepository) {
        this.projectService = projectService;
        this.locationRepository = locationRepository;
        this.sectionRepository = sectionRepository;
    }

    /**
     * Save a location.
     *
     * @param location the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public Location save(Location location) {
        log.debug("Request to save Location : {}", location);
        return locationRepository.save(location);
    }

    /**
     * Get all the locations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Location> findAll(Pageable pageable) {
        log.debug("Request to get all Locations");
        return locationRepository.findAll(pageable);
    }

    /**
     * Get one location by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Location> findOne(Long id) {
        log.debug("Request to get Location : {}", id);
        return locationRepository.findById(id);
    }

    /**
     * Delete the location by id.
     *
     * @param id the id of the entity.
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Location : {}", id);
        sectionRepository.deleteAllByLocationId(id);
        locationRepository.deleteById(id);
    }

    /**
     * Find all Locations for the given project.
     *
     * @param projectId the project to retrieve locations for.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Location> findAllByProjectId(Long projectId, Sort sort) {
        log.debug("Request to get all Locations for Project {}", projectId);
        return locationRepository.findAllByProjectId(projectId, Sort.by(sort.stream().map(Order::ignoreCase).collect(Collectors.toList())));
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Location`, identified by id. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@locationService.hasAccessToLocation(#location, 'ADMIN', 'SECRETARY')")`
     *
     * @param locationId the id of the location with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToLocation(Long locationId, String... roles) {
        if (locationId == null) {
            throw new IdMustBePresentException();
        }

        Location location = findOne(locationId).orElseThrow(EntityNotFoundException::new);
        return hasAccessToLocation(location, roles);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Location`. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@locationService.hasAccessToLocation(#location, 'ADMIN', 'SECRETARY')")`
     *
     * @param location the entity with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToLocation(Location location, String... roles) {
        return projectService.hasAccessToProject(location.getProject(), roles);
    }
}
