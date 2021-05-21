package io.github.bbortt.event.planner.backend.event.listener;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistory;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import io.github.bbortt.event.planner.backend.event.EventHistoryEvent;
import io.github.bbortt.event.planner.backend.service.EventHistoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class EventHistoryEventListener {

    private static final Logger log = LoggerFactory.getLogger(EventHistoryEventListener.class);

    private EventHistoryService eventHistoryService;

    public EventHistoryEventListener(EventHistoryService eventHistoryService) {
        this.eventHistoryService = eventHistoryService;
    }

    @Async
    @EventListener({ EventHistoryEvent.class })
    public void eventHistoryEvent(EventHistoryEvent eventHistoryEvent) {
        log.info("Processing {}", eventHistoryEvent);

        eventHistoryService.save(
            createEventHistory(eventHistoryEvent.getEvent(), eventHistoryEvent.getAction(), eventHistoryEvent.getCreatedBy())
        );
    }

    private EventHistory createEventHistory(Event event, EventHistoryAction action, String createdBy) {
        return new EventHistory()
            .eventId(event.getId())
            .action(action)
            .name(event.getName())
            .description(event.getDescription())
            .startTime(event.getStartTime())
            .endTime(event.getEndTime())
            .section(event.getSection())
            .jhiUserId(event.getJhiUserId())
            .createdBy(createdBy);
    }
}
