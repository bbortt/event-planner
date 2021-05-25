package io.github.bbortt.event.planner.backend.web.rest;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistory;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.security.RolesConstants;
import io.github.bbortt.event.planner.backend.service.EventHistoryService;
import io.github.bbortt.event.planner.backend.service.ProjectService;
import io.github.bbortt.event.planner.backend.service.dto.EventDTO;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link Event}.
 */
@RestController
@RequestMapping("/api/events/history")
public class EventHistoryResource {

    private final Logger log = LoggerFactory.getLogger(EventHistoryResource.class);

    private static final String ENTITY_NAME = "eventHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventHistoryService eventHistoryService;
    private final ProjectService projectService;

    public EventHistoryResource(EventHistoryService eventHistoryService, ProjectService projectService) {
        this.eventHistoryService = eventHistoryService;
        this.projectService = projectService;
    }

    /**
     * {@code GET  /projects/:projectId} : get all the EventHistory entries by Project.
     *
     * @param projectId the Project identifier.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of events in body.
     */
    @GetMapping("/projects/{projectId}")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<List<EventHistory>> getAllEvents(
        @PathVariable Long projectId,
        @RequestParam(name = "showSince", required = false) Optional<ZonedDateTime> showSince,
        Pageable pageable
    ) {
        log.debug("REST request to get a page of EventHistory entries for Project {}", projectId);

        Page<EventHistory> page;
        if (showSince.isPresent()) {
            page = eventHistoryService.findAllByProjectIdSince(projectId, showSince.get(), pageable);
        } else {
            page = eventHistoryService.findAllByProjectId(projectId, pageable);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /:id} : get the "id" EventHistory entry.
     *
     * @param id the id of the EventHistory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the event, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize(
        "@eventHistoryService.hasAccessToEventHistory(#id, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")"
    )
    public ResponseEntity<EventHistory> getEvent(@PathVariable Long id) {
        log.debug("REST request to get EventHistory entry : {}", id);
        return ResponseUtil.wrapOrNotFound(eventHistoryService.findOne(id));
    }
}
