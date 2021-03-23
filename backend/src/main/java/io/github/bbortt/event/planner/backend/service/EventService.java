package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.repository.EventRepository;
import io.github.bbortt.event.planner.backend.repository.SectionRepository;
import io.github.bbortt.event.planner.backend.service.exception.BadRequestException;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.backend.service.exception.IdMustBePresentException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Event}.
 */
@Service
public class EventService {

    private final Logger log = LoggerFactory.getLogger(EventService.class);

    private final ProjectService projectService;

    private final SectionRepository sectionRepository;
    private final EventRepository eventRepository;

    public EventService(ProjectService projectService, SectionRepository sectionRepository, EventRepository eventRepository) {
        this.projectService = projectService;
        this.sectionRepository = sectionRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * Save a event.
     *
     * @param event the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public Event save(Event event) {
        log.debug("Request to save Event : {}", event);

        if (event.getResponsibility() != null && event.getUser() != null) {
            log.error("Event does contain responsibility AND user!");
            throw new BadRequestException();
        }

        return eventRepository.save(event);
    }

    /**
     * Get all the events.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Event> findAll(Pageable pageable) {
        log.debug("Request to get all Events");
        return eventRepository.findAll(pageable);
    }

    /**
     * Get all the events with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Event> findAllWithEagerRelationships(Pageable pageable) {
        return eventRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one event by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Event> findOne(Long id) {
        log.debug("Request to get Event : {}", id);
        return eventRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Get event name by id.
     *
     * @param id the id of the entity.
     * @return name of the entity.
     */
    @Transactional(readOnly = true)
    public Optional<String> findNameByEventId(Long id) {
        log.debug("Request to get name of Event : {}", id);
        return eventRepository.findNameByEventId(id);
    }

    /**
     * Delete the event by id.
     *
     * @param id the id of the entity.
     */
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Event`, identified by id. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@eventService.hasAccessToEvent(#event, 'ADMIN', 'SECRETARY')")`
     *
     * @param eventId the id of the location with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToEvent(Long eventId, String... roles) {
        if (eventId == null) {
            throw new IdMustBePresentException();
        }

        Event event = findOne(eventId).orElseThrow(EntityNotFoundException::new);
        return hasAccessToEvent(event, roles);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Event`. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@eventService.hasAccessToSection(#event, 'ADMIN', 'SECRETARY')")`
     *
     * @param event the entity with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToEvent(Event event, String... roles) {
        return projectService.hasAccessToProject(event.getSection().getLocation().getProject(), roles);
    }
}
