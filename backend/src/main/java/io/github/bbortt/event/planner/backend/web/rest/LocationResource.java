package io.github.bbortt.event.planner.backend.web.rest;

import io.github.bbortt.event.planner.backend.domain.Location;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.security.RolesConstants;
import io.github.bbortt.event.planner.backend.service.LocationService;
import io.github.bbortt.event.planner.backend.service.dto.LocationDTO;
import io.github.bbortt.event.planner.backend.service.dto.SectionDTO;
import io.github.bbortt.event.planner.backend.service.dto.scheduler.SchedulerSectionDTO;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.backend.service.mapper.EventMapper;
import io.github.bbortt.event.planner.backend.service.mapper.LocationMapper;
import io.github.bbortt.event.planner.backend.service.mapper.SectionMapper;
import io.github.bbortt.event.planner.backend.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.TreeSet;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link Location}.
 */
@RestController
@RequestMapping("/api")
public class LocationResource {

    private final Logger log = LoggerFactory.getLogger(LocationResource.class);

    private static final String ENTITY_NAME = "location";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LocationService locationService;

    private final LocationMapper locationMapper;
    private final SectionMapper sectionMapper;
    private final EventMapper eventMapper;

    public LocationResource(
        LocationService locationService,
        LocationMapper locationMapper,
        SectionMapper sectionMapper,
        EventMapper eventMapper
    ) {
        this.locationService = locationService;
        this.locationMapper = locationMapper;
        this.sectionMapper = sectionMapper;
        this.eventMapper = eventMapper;
    }

    /**
     * {@code POST  /locations} : Create a new location.
     *
     * @param location the location to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new location, or with status {@code 400 (Bad Request)} if the location has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/locations")
    @PreAuthorize("@locationService.hasAccessToLocation(#location, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<LocationDTO> createLocation(@Valid @RequestBody LocationDTO location) throws URISyntaxException {
        log.debug("REST request to save Location : {}", location);
        if (location.getId() != null) {
            throw new BadRequestAlertException("A new location cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Location result = locationService.save(fromDTO(location));
        return ResponseEntity
            .created(new URI("/api/locations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getName()))
            .body(toDTO(result));
    }

    /**
     * {@code PUT  /locations} : Updates an existing location.
     *
     * @param location the location to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated location, or with status {@code 400 (Bad Request)} if the location is not valid, or with status {@code 500 (Internal Server Error)} if the location couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/locations")
    @PreAuthorize("@locationService.hasAccessToLocation(#location, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<LocationDTO> updateLocation(@Valid @RequestBody LocationDTO location) throws URISyntaxException {
        log.debug("REST request to update Location : {}", location);
        if (location.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Location result = locationService.save(fromDTO(location));
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, location.getName()))
            .body(toDTO(result));
    }

    /**
     * {@code GET  /locations} : get all the locations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of locations in body.
     */
    @GetMapping("/locations")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<LocationDTO>> getAllLocations(Pageable pageable) {
        log.debug("REST request to get a page of Locations");
        Page<Location> page = locationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent().stream().map(this::toDTO).collect(Collectors.toList()));
    }

    /**
     * {@code GET  /locations/:id} : get the "id" location.
     *
     * @param id the id of the location to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the location, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/locations/{id}")
    @PreAuthorize(
        "@locationService.hasAccessToLocation(#id, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\", \"" +
        RolesConstants.CONTRIBUTOR +
        "\", \"" +
        RolesConstants.VIEWER +
        "\")"
    )
    public ResponseEntity<LocationDTO> getLocation(@PathVariable Long id) {
        log.debug("REST request to get Location : {}", id);
        Optional<Location> location = locationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(location.map(this::toDTO));
    }

    /**
     * {@code GET /locations/project/:projectId} : get all Locations by project id.
     *
     * @param projectId the id of the project.
     * @param sort optional sort of locations
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the location, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/locations/project/{projectId}")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#projectId, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\", \"" +
        RolesConstants.CONTRIBUTOR +
        "\", \"" +
        RolesConstants.VIEWER +
        "\")"
    )
    public ResponseEntity<List<LocationDTO>> getLocationsByProjectId(@PathVariable Long projectId, Sort sort) {
        log.debug("REST Request to get Locations by projectId {}", projectId);
        List<Location> locations = locationService.findAllByProjectId(projectId, sort);
        return ResponseEntity.ok(
            locations.stream().map(location -> locationMapper.dtoFromLocation(location, null)).collect(Collectors.toList())
        );
    }

    /**
     * {@code GET /locations/project/:projectId} : get all Locations and their Sections by project id.
     *
     * @param projectId the id of the project.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the location, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/locations/project/{projectId}/sections")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<List<LocationDTO>> getLocationsByProjectIdJoinSections(@PathVariable Long projectId) {
        log.debug("REST Request to get Locations inclusive Sections by projectId {}", projectId);
        List<Location> locations = locationService.findAllByProjectIdJoinSections(projectId);
        return ResponseEntity.ok(locations.stream().map(this::toDTO).collect(Collectors.toList()));
    }

    /**
     * {@code POST /locations/project/:projectId/name-exists} : Whether the given name exists in this Project.
     *
     * @param projectId the Project identifier.
     * @param name the value to check.
     * @return true if the value exists.
     */
    @PostMapping("/locations/project/{projectId}/name-exists")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<Boolean> isNameExistingInProject(@PathVariable Long projectId, @RequestBody String name) {
        log.debug("REST request to check uniqueness of name '{}' by projectId : {}", name, projectId);
        Boolean isExisting = locationService.isNameExistingInProject(projectId, name);
        return ResponseEntity.ok(isExisting);
    }

    /**
     * {@code DELETE  /locations/:id} : delete the "id" location.
     *
     * @param id the id of the location to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/locations/{id}")
    @PreAuthorize("@locationService.hasAccessToLocation(#id, \"" + RolesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        log.debug("REST request to delete Location : {}", id);
        String name = locationService.findNameByLocationId(id).orElseThrow(EntityNotFoundException::new);
        locationService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, name)).build();
    }

    private Location fromDTO(LocationDTO locationDTO) {
        return locationMapper.locationFromDTO(
            locationDTO,
            locationDTO
                .getSections()
                .stream()
                .map(
                    sectionDTO ->
                        sectionMapper.sectionFromDTO(
                            sectionDTO,
                            null,
                            sectionDTO
                                .getEvents()
                                .stream()
                                .map(eventDTO -> eventMapper.eventFromDTO(eventDTO, null))
                                .collect(Collectors.toSet())
                        )
                )
                .collect(Collectors.toSet())
        );
    }

    private LocationDTO toDTO(Location location) {
        return locationMapper.dtoFromLocation(
            location,
            location
                .getSections()
                .stream()
                .map(section -> sectionMapper.dtoFromSection(section, null, null))
                .collect(
                    Collectors.toCollection(() -> new TreeSet<>(Comparator.comparing(SectionDTO::getName, String.CASE_INSENSITIVE_ORDER)))
                )
        );
    }
}
