package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.repository.EventRepository;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import io.github.bbortt.event.planner.service.mapper.EventMapper;
import io.github.bbortt.event.planner.web.rest.EventResource;
import io.github.bbortt.event.planner.web.rest.errors.BadRequestAlertException;
import java.util.Objects;
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
@Transactional
public class EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;

    private final EventMapper eventMapper;

    public EventService(EventRepository eventRepository, EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
    }

    /**
     * Save an event.
     *
     * @param eventDTO the entity to save.
     * @return the persisted entity.
     */
    public EventDTO save(EventDTO eventDTO) {
        logger.debug("Request to save Event : {}", eventDTO);
        Event event = eventMapper.toEntity(eventDTO);

        validateEvent(event);

        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    /**
     * Update an event.
     *
     * @param eventDTO the entity to save.
     * @return the persisted entity.
     */
    public EventDTO update(EventDTO eventDTO) {
        logger.debug("Request to update Event : {}", eventDTO);
        Event event = eventMapper.toEntity(eventDTO);

        validateEvent(event);

        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    /**
     * Partially update an event.
     *
     * @param eventDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<EventDTO> partialUpdate(EventDTO eventDTO) {
        logger.debug("Request to partially update Event : {}", eventDTO);

        return eventRepository
            .findById(eventDTO.getId())
            .map(existingEvent -> {
                eventMapper.partialUpdate(existingEvent, eventDTO);

                return existingEvent;
            })
            .map(eventRepository::save)
            .map(eventMapper::toDto);
    }

    /**
     * Get all the events.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<EventDTO> findAll(Pageable pageable) {
        logger.debug("Request to get all Events");
        return eventRepository.findAll(pageable).map(eventMapper::toDto);
    }

    /**
     * Get all the events with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<EventDTO> findAllWithEagerRelationships(Pageable pageable) {
        return eventRepository.findAllWithEagerRelationships(pageable).map(eventMapper::toDto);
    }

    /**
     * Get one event by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<EventDTO> findOne(Long id) {
        logger.debug("Request to get Event : {}", id);
        return eventRepository.findOneWithEagerRelationships(id).map(eventMapper::toDto);
    }

    /**
     * Delete the event by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        logger.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
    }

    /**
     * Get all events of a {@link io.github.bbortt.event.planner.domain.Project}.
     *
     * @param projectId the id of the {@link io.github.bbortt.event.planner.domain.Project}.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("T(io.github.bbortt.event.planner.security.SecurityUtils).isAuthenticated()")
    public Page<EventDTO> findAllInProject(Long projectId, Pageable pageable) {
        logger.debug("Request to get a page of Locations in Project '{}'", projectId);
        return eventRepository.findAllByLocation_Project_IdEquals(projectId, pageable).map(eventMapper::toDto);
    }

    private void validateEvent(Event event) {
        logger.debug("Validating Event : {}", event);

        if (Objects.isNull(event.getLocation()) || Objects.isNull(event.getLocation().getId())) {
            throw new BadRequestAlertException(
                "An Event must be associated to a valid Location",
                EventResource.ENTITY_NAME,
                "event.constraints.location"
            );
        }

        if (
            Objects.isNull(event.getStartDateTime()) ||
            Objects.isNull(event.getEndDateTime()) ||
            event.getStartDateTime().isAfter(event.getEndDateTime())
        ) {
            throw new BadRequestAlertException(
                "End Date cannot occur before Start Date",
                EventResource.ENTITY_NAME,
                "event.validation.startDateTimeBeforeEndDateTime"
            );
        }
    }
}
