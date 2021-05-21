package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.domain.EventHistory;
import io.github.bbortt.event.planner.backend.repository.EventHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventHistoryService {

    private static final Logger log = LoggerFactory.getLogger(EventHistoryService.class);

    private EventHistoryRepository eventHistoryRepository;

    public EventHistoryService(EventHistoryRepository eventHistoryRepository) {
        this.eventHistoryRepository = eventHistoryRepository;
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
}
