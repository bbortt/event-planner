package io.github.bbortt.event.planner.backend.web.rest;

import io.github.bbortt.event.planner.backend.domain.LocationTimeSlot;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.LocationTimeSlotService;
import io.github.bbortt.event.planner.backend.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link LocationTimeSlot}.
 */
@RestController
@RequestMapping("/api")
public class LocationTimeSlotResource {

    private final Logger log = LoggerFactory.getLogger(LocationTimeSlotResource.class);

    private static final String ENTITY_NAME = "locationTimeSlot";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LocationTimeSlotService locationTimeSlotService;

    public LocationTimeSlotResource(LocationTimeSlotService locationTimeSlotService) {
        this.locationTimeSlotService = locationTimeSlotService;
    }

    /**
     * {@code POST  /location-time-slots} : Create a new locationTimeSlot.
     *
     * @param locationTimeSlot the locationTimeSlot to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new locationTimeSlot, or with status {@code 400 (Bad Request)} if the locationTimeSlot has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/location-time-slots")
    public ResponseEntity<LocationTimeSlot> createLocationTimeSlot(@Valid @RequestBody LocationTimeSlot locationTimeSlot)
        throws URISyntaxException {
        log.debug("REST request to save LocationTimeSlot : {}", locationTimeSlot);
        if (locationTimeSlot.getId() != null) {
            throw new BadRequestAlertException("A new locationTimeSlot cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LocationTimeSlot result = locationTimeSlotService.save(locationTimeSlot);
        return ResponseEntity
            .created(new URI("/api/location-time-slots/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /location-time-slots} : Updates an existing locationTimeSlot.
     *
     * @param locationTimeSlot the locationTimeSlot to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated locationTimeSlot,
     * or with status {@code 400 (Bad Request)} if the locationTimeSlot is not valid,
     * or with status {@code 500 (Internal Server Error)} if the locationTimeSlot couldn't be updated.
     */
    @PutMapping("/location-time-slots")
    public ResponseEntity<LocationTimeSlot> updateLocationTimeSlot(@Valid @RequestBody LocationTimeSlot locationTimeSlot) {
        log.debug("REST request to update LocationTimeSlot : {}", locationTimeSlot);
        if (locationTimeSlot.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        LocationTimeSlot result = locationTimeSlotService.save(locationTimeSlot);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, locationTimeSlot.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /location-time-slots} : get all the locationTimeSlots.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of locationTimeSlots in body.
     */
    @GetMapping("/location-time-slots")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<LocationTimeSlot>> getAllLocationTimeSlots(Pageable pageable) {
        log.debug("REST request to get a page of LocationTimeSlots");
        Page<LocationTimeSlot> page = locationTimeSlotService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /location-time-slots/:id} : get the "id" locationTimeSlot.
     *
     * @param id the id of the locationTimeSlot to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the locationTimeSlot, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/location-time-slots/{id}")
    public ResponseEntity<LocationTimeSlot> getLocationTimeSlot(@PathVariable Long id) {
        log.debug("REST request to get LocationTimeSlot : {}", id);
        Optional<LocationTimeSlot> locationTimeSlot = locationTimeSlotService.findOne(id);
        return ResponseUtil.wrapOrNotFound(locationTimeSlot);
    }

    /**
     * {@code DELETE  /location-time-slots/:id} : delete the "id" locationTimeSlot.
     *
     * @param id the id of the locationTimeSlot to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/location-time-slots/{id}")
    public ResponseEntity<Void> deleteLocationTimeSlot(@PathVariable Long id) {
        log.debug("REST request to delete LocationTimeSlot : {}", id);
        locationTimeSlotService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
