package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistory;
import io.github.bbortt.event.planner.backend.repository.EventHistoryRepository;
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

@Service
public class EventHistoryService {

    private static final Logger log = LoggerFactory.getLogger(EventHistoryService.class);

    private final EventHistoryRepository eventHistoryRepository;
    private final RoleService roleService;

    public EventHistoryService(EventHistoryRepository eventHistoryRepository, RoleService roleService) {
        this.eventHistoryRepository = eventHistoryRepository;
        this.roleService = roleService;
    }

    /**
     * Save a event.
     *
     * @param eventHistory the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public EventHistory save(EventHistory eventHistory) {
        log.debug("Request to save EventHistory : {}", eventHistory);
        return eventHistoryRepository.save(eventHistory);
    }

    /**
     * Delete the event history for a specific project.
     *
     * @param projectId the project id
     */
    @Transactional
    public void deleteHistoryByProject(Long projectId) {
        log.debug("Request to delete EventHistory by projectId : {}", projectId);
        eventHistoryRepository.deleteAllByProjectId(projectId);
    }

    /**
     * Read the whole event history for a specified project.
     *
     * @param pageable the pageable information
     * @return the event history
     */
    @Transactional(readOnly = true)
    public Page<EventHistory> findAllByProjectId(Long projectId, Pageable pageable) {
        log.debug("REST request to get a page of EventHistory entries for Project {}", projectId);
        return eventHistoryRepository.findAllByProjectId(projectId, pageable);
    }

    @Transactional(readOnly = true)
    public Optional<EventHistory> findOne(Long eventHistoryId) {
        log.debug("REST request to get EventHistory entry : {}", eventHistoryId);
        return eventHistoryRepository.findById(eventHistoryId);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public boolean hasAccessToEventHistory(Long eventHistoryId, String... roles) {
        if (eventHistoryId == null) {
            throw new IdMustBePresentException();
        }

        return roleService.hasAnyRoleInProject(eventHistoryRepository.findProjectById(eventHistoryId), roles);
    }
}
