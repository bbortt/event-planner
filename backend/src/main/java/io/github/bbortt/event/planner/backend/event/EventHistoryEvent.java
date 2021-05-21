package io.github.bbortt.event.planner.backend.event;

import io.github.bbortt.event.planner.backend.config.Constants;
import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import io.github.bbortt.event.planner.backend.security.SecurityUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.context.ApplicationEvent;

public class EventHistoryEvent extends ApplicationEvent {

    private final Event event;
    private final EventHistoryAction action;
    private final String createdBy;

    /**
     * Create a new {@code ApplicationEvent}.
     *
     * @param source the object on which the event initially occurred or with which the event is associated (never {@code null})
     * @param event the newly created event
     */
    public EventHistoryEvent(Object source, Event event, EventHistoryAction action) {
        super(source);
        this.event = event;
        this.action = action;
        this.createdBy = SecurityUtils.getCurrentUserLogin().orElse(Constants.SYSTEM);
    }

    public Event getEvent() {
        return event;
    }

    public EventHistoryAction getAction() {
        return action;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
            .append("event", this.event)
            .append("action", this.action)
            .append("createdBy", this.createdBy)
            .build();
    }
}
