package io.github.bbortt.event.planner.web.rest;

import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.RolesConstants;
import io.github.bbortt.event.planner.service.LocationService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
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

/**
 * REST controller for managing {@link io.github.bbortt.event.planner.domain.Location}.
 */
@RestController
@RequestMapping("/api")
public class LocationResource {

    private final Logger log = LoggerFactory.getLogger(LocationResource.class);

    private static final String ENTITY_NAME = "location";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LocationService locationService;
    private final ProjectService projectService;

    public LocationResource(LocationService locationService, ProjectService projectService) {
        this.locationService = locationService;
        this.projectService = projectService;
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
    public ResponseEntity<Location> createLocation(@Valid @RequestBody Location location) throws URISyntaxException {
        log.debug("REST request to save Location : {}", location);
        if (location.getId() != null) {
            throw new BadRequestAlertException("A new location cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Location result = locationService.save(location);
        return ResponseEntity
            .created(new URI("/api/locations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getName()))
            .body(result);
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
    public ResponseEntity<Location> updateLocation(@Valid @RequestBody Location location) throws URISyntaxException {
        log.debug("REST request to update Location : {}", location);
        if (location.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Location result = locationService.save(location);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, location.getName()))
            .body(result);
    }

    /**
     * {@code GET  /locations} : get all the locations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of locations in body.
     */
    @GetMapping("/locations")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<Location>> getAllLocations(Pageable pageable) {
        log.debug("REST request to get a page of Locations");
        Page<Location> page = locationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /locations/:id} : get the "id" location.
     *
     * @param id the id of the location to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the location, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/locations/{id}")
    @PreAuthorize("@locationService.hasAccessToLocation(#id, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<Location> getLocation(@PathVariable Long id) {
        log.debug("REST request to get Location : {}", id);
        Optional<Location> location = locationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(location);
    }

    /**
     * {@code GET /locations/project/:projectId} : get all Locations by project id.
     *
     * @param projectId the id of the project.
     * @param sort      optional sort of locations
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
    public ResponseEntity<List<Location>> getLocationsByProjectId(@PathVariable Long projectId, Sort sort) {
        log.debug("REST Request to get Locations by projectId {}", projectId);
        List<Location> locations = locationService.findAllByProjectId(projectId, sort);
        return ResponseEntity.ok(locations);
    }

    /**
     * {@code GET /locations/project/:projectId} : get all Locations and their Sections by project id.
     *
     * @param projectId the id of the project.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the location, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/locations/project/{projectId}/sections")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<List<Location>> getLocationsByProjectIdJoinSections(@PathVariable Long projectId) {
        log.debug("REST Request to get Locations inclusive Sections by projectId {}", projectId);
        List<Location> locations = locationService.findAllByProjectIdJoinSections(projectId);
        return ResponseEntity.ok(locations);
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
}
