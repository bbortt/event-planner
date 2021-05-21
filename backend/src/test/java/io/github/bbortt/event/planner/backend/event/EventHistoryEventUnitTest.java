package io.github.bbortt.event.planner.backend.event;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

class EventHistoryEventUnitTest {

    @Test
    void constructorAcceptsArguments() {
        Event event = new Event();
        EventHistoryAction action = EventHistoryAction.CREATE;

        EventHistoryEvent eventHistoryEvent = new EventHistoryEvent(this, event, action);

        Assertions
            .assertThat(eventHistoryEvent)
            .hasFieldOrPropertyWithValue("source", this)
            .hasFieldOrPropertyWithValue("event", event)
            .hasFieldOrPropertyWithValue("action", action);
    }
}
