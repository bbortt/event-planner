package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import io.github.bbortt.event.planner.backend.event.EventHistoryEvent;
import io.github.bbortt.event.planner.backend.repository.EventRepository;
import io.github.bbortt.event.planner.backend.repository.SectionRepository;
import io.github.bbortt.event.planner.backend.service.dto.EventDTO;
import io.github.bbortt.event.planner.backend.service.exception.BadRequestException;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import io.github.bbortt.event.planner.backend.service.exception.IdMustBePresentException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
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

    private final ApplicationEventPublisher publisher;

    private final ProjectService projectService;

    private final EventRepository eventRepository;

    public EventService(ApplicationEventPublisher publisher, ProjectService projectService, EventRepository eventRepository) {
        this.publisher = publisher;
        this.projectService = projectService;
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

        if (event.getResponsibility() != null && event.getJhiUserId() != null) {
            log.error("Event does contain responsibility AND user!");
            throw new BadRequestException();
        }

        boolean isNew = event.getId() == null;
        eventRepository.save(event);

        if (isNew) {
            publisher.publishEvent(new EventHistoryEvent(this, event, EventHistoryAction.CREATE));
        } else {
            publisher.publishEvent(new EventHistoryEvent(this, event, EventHistoryAction.UPDATE));
        }

        return event;
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
     * Delete the event by id.
     *
     * @param event the entity.
     */
    @Transactional
    public void delete(Event event) {
        log.debug("Request to delete Event : {}", event);
        eventRepository.deleteById(event.getId());
        publisher.publishEvent(new EventHistoryEvent(this, event, EventHistoryAction.DELETE));
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
        return projectService.hasAccessToProject(event.getSection().getLocation().getProject(), roles);
    }

    /**
     * Checks if the current user has access to the `Project` linked to the given `Event`. The project access must be given by any of the `roles`. Example usage: `@PreAuthorize("@eventService.hasAccessToSection(#event, 'ADMIN', 'SECRETARY')")`
     *
     * @param eventDTO the entity with a linked project to check.
     * @param roles to look out for.
     * @return true if the project access has any of the roles.
     */
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToEvent(EventDTO eventDTO, String... roles) {
        if (eventDTO == null) {
            throw new BadRequestException();
        }

        return projectService.hasAccessToProject(eventDTO.getSection().getLocation().getProject(), roles);
    }
}
