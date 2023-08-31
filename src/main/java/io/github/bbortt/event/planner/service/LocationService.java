package io.github.bbortt.event.planner.service;

import static io.github.bbortt.event.planner.web.rest.LocationResource.ENTITY_NAME;

import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import io.github.bbortt.event.planner.service.mapper.LocationMapper;
import io.github.bbortt.event.planner.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Location}.
 */
@Service
@Transactional
public class LocationService {

    private static final Logger logger = LoggerFactory.getLogger(LocationService.class);

    private final LocationRepository locationRepository;

    private final LocationMapper locationMapper;

    public LocationService(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    /**
     * Save a location.
     *
     * @param locationDTO the entity to save.
     * @return the persisted entity.
     */
    public LocationDTO save(LocationDTO locationDTO) {
        logger.debug("Request to save Location : {}", locationDTO);
        Location location = locationMapper.toEntity(locationDTO);

        validateLocation(location);

        location = locationRepository.save(location);
        return locationMapper.toDto(location);
    }

    private void validateLocation(Location location) {
        logger.debug("Validating Location : {}", location);

        if (Objects.isNull(location.getProject()) || Objects.isNull(location.getProject().getId())) {
            throw new BadRequestAlertException(
                "A Location must be associated to a valid Project",
                ENTITY_NAME,
                "location.constraints.project"
            );
        }
    }

    /**
     * Update a location.
     *
     * @param locationDTO the entity to save.
     * @return the persisted entity.
     */
    public LocationDTO update(LocationDTO locationDTO) {
        logger.debug("Request to update Location : {}", locationDTO);
        Location location = locationMapper.toEntity(locationDTO);
        location = locationRepository.save(location);
        return locationMapper.toDto(location);
    }

    /**
     * Partially update a location.
     *
     * @param locationDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<LocationDTO> partialUpdate(LocationDTO locationDTO) {
        logger.debug("Request to partially update Location : {}", locationDTO);

        return locationRepository
            .findById(locationDTO.getId())
            .map(existingLocation -> {
                locationMapper.partialUpdate(existingLocation, locationDTO);

                return existingLocation;
            })
            .map(locationRepository::save)
            .map(locationMapper::toDto);
    }

    /**
     * Get all the locations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<LocationDTO> findAll(Pageable pageable) {
        logger.debug("Request to get all Locations");
        return locationRepository.findAll(pageable).map(locationMapper::toDto);
    }

    /**
     * Get all the locations with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<LocationDTO> findAllWithEagerRelationships(Pageable pageable) {
        return locationRepository.findAllWithEagerRelationships(pageable).map(locationMapper::toDto);
    }

    /**
     * Get one location by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LocationDTO> findOne(Long id) {
        logger.debug("Request to get Location : {}", id);
        return locationRepository.findOneWithEagerRelationships(id).map(locationMapper::toDto);
    }

    /**
     * Delete the location by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        logger.debug("Request to delete Location : {}", id);
        locationRepository.deleteById(id);
    }

    /**
     * Get all locations of a {@link io.github.bbortt.event.planner.domain.Project}.
     *
     * @param projectId the id of the {@link io.github.bbortt.event.planner.domain.Project}.

     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("T(io.github.bbortt.event.planner.security.SecurityUtils).isAuthenticated()")
    public List<LocationDTO> findAllInProject(Long projectId) {
        logger.debug("Request to get all Locations in Project '{}'", projectId);
        return locationRepository.findAllByParentIsNullAndProject_IdEquals(projectId).stream().map(locationMapper::toDto).toList();
    }

    /**
     * Get all locations of a {@link io.github.bbortt.event.planner.domain.Project}, except the one {@link Location} by id.
     *
     * @param projectId the id of the {@link io.github.bbortt.event.planner.domain.Project}.
     * @param locationId the id of the {@link io.github.bbortt.event.planner.domain.Location}.

     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("T(io.github.bbortt.event.planner.security.SecurityUtils).isAuthenticated()")
    public List<LocationDTO> findAllInProjectExceptThis(Long projectId, Long locationId) {
        logger.debug("Request to get all Locations except '{}' in Project '{}'", locationId, projectId);
        return locationRepository
            .findAllByParentIsNullAndProject_IdEquals(projectId)
            .stream()
            .filter(location -> !location.getId().equals(locationId))
            .map(location -> {
                location.setChildren(dropLocationsMatchingId(location.getChildren(), locationId));
                return location;
            })
            .map(locationMapper::toDto)
            .toList();
    }

    private Set<Location> dropLocationsMatchingId(Set<Location> locations, Long locationId) {
        if (logger.isTraceEnabled()) {
            logger.trace("Filter Locations by id '{}': {}", locationId, locations);
        }

        return locations
            .stream()
            .filter(location -> !location.getId().equals(locationId))
            .map(location -> {
                location.setChildren(dropLocationsMatchingId(location.getChildren(), locationId));
                return location;
            })
            .collect(Collectors.toSet());
    }
}
