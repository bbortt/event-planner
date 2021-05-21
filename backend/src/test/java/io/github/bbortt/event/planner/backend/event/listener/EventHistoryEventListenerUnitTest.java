package io.github.bbortt.event.planner.backend.event.listener;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistory;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.event.EventHistoryEvent;
import io.github.bbortt.event.planner.backend.service.EventHistoryService;
import java.lang.reflect.Method;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.event.EventListener;

@ExtendWith(MockitoExtension.class)
class EventHistoryEventListenerUnitTest {

    @Mock
    EventHistoryService eventHistoryServiceMock;

    EventHistoryEventListener fixture;

    @BeforeEach
    public void beforeEachSetup() {
        fixture = new EventHistoryEventListener(eventHistoryServiceMock);
    }

    @Test
    void constructorAcceptsArguments() {
        Assertions.assertThat(fixture).hasFieldOrPropertyWithValue("eventHistoryService", eventHistoryServiceMock);
    }

    @Test
    void eventHistoryEventIsAnEventListener() throws NoSuchMethodException {
        Method eventHistoryEvent = fixture.getClass().getDeclaredMethod("eventHistoryEvent", EventHistoryEvent.class);
        Assertions.assertThat(eventHistoryEvent).isNotNull();
        Assertions.assertThat(eventHistoryEvent.getDeclaredAnnotation(EventListener.class)).isNotNull();
    }

    @Test
    void eventHistoryEventPersistsCREATEHistoryEntity() {
        Event event = new Event().section(new Section().id(2345L));
        EventHistoryAction action = EventHistoryAction.CREATE;

        fixture.eventHistoryEvent(new EventHistoryEvent(this, event, action));
        verify(eventHistoryServiceMock)
            .save(
                argThat(
                    eventHistory -> {
                        assertEventHistoryCopiedOriginalValues(eventHistory, event);
                        return true;
                    }
                )
            );
    }

    @Test
    void eventHistoryEventPersistsUPDATEHistoryEntity() {
        Event updateEvent = new Event().id(1234L).section(new Section().id(2345L));
        EventHistoryAction updateAction = EventHistoryAction.UPDATE;

        fixture.eventHistoryEvent(new EventHistoryEvent(this, updateEvent, updateAction));
        verify(eventHistoryServiceMock)
            .save(
                argThat(
                    eventHistory -> {
                        assertEventHistoryCopiedOriginalValues(eventHistory, updateEvent);
                        return true;
                    }
                )
            );
    }

    private void assertEventHistoryCopiedOriginalValues(EventHistory eventHistory, Event event) {
        Assertions
            .assertThat(eventHistory)
            .hasFieldOrPropertyWithValue("eventId", event.getId())
            .hasFieldOrPropertyWithValue("name", event.getName())
            .hasFieldOrPropertyWithValue("description", event.getDescription())
            .hasFieldOrPropertyWithValue("startTime", event.getStartTime())
            .hasFieldOrPropertyWithValue("endTime", event.getEndTime())
            .hasFieldOrPropertyWithValue("sectionId", event.getSection().getId())
            .hasFieldOrPropertyWithValue("jhiUserId", event.getJhiUserId());
    }
}
