package io.github.bbortt.event.planner.backend.service;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.backend.config.Constants;
import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.repository.EventRepository;
import io.github.bbortt.event.planner.backend.repository.SectionRepository;
import io.github.bbortt.event.planner.backend.service.exception.BadRequestException;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

@ExtendWith(MockitoExtension.class)
class EventServiceUnitTest {

    @Mock
    ApplicationEventPublisher publisherMock;

    @Mock
    ProjectService projectServiceMock;

    @Mock
    EventRepository eventRepositoryMock;

    EventService fixture;

    @BeforeEach
    void beforeTestSetup() {
        fixture = new EventService(publisherMock, projectServiceMock, eventRepositoryMock);
    }

    @Test
    void saveDoesAcceptEitherResponsibilityOrUser() {
        Event eventWithUser = new Event().jhiUserId("test-jhi-user-id");
        fixture.save(eventWithUser);

        Event eventWithResponsibility = new Event().responsibility(new Responsibility());
        fixture.save(eventWithResponsibility);

        Event invalidEvent = new Event().jhiUserId("test-jhi-user-id").responsibility(new Responsibility());

        Assertions.assertThatThrownBy(() -> fixture.save(invalidEvent)).isInstanceOf(BadRequestException.class);
    }

    @Test
    void saveDoesBroadcastApplicationEvent() {
        Event event = new Event();

        doReturn(event).when(eventRepositoryMock).save(event);

        fixture.save(event);

        verify(publisherMock)
            .publishEvent(
                argThat(
                    eventHistoryEvent -> {
                        Assertions
                            .assertThat(eventHistoryEvent)
                            .hasFieldOrPropertyWithValue("event", event)
                            .hasFieldOrPropertyWithValue("action", EventHistoryAction.CREATE)
                            .hasFieldOrPropertyWithValue("createdBy", Constants.SYSTEM);
                        return true;
                    }
                )
            );
    }

    @Test
    void updateDoesBroadcastApplicationEvent() {
        Event event = new Event().id(1234L);

        doReturn(event).when(eventRepositoryMock).save(event);

        fixture.save(event);

        verify(publisherMock)
            .publishEvent(
                argThat(
                    eventHistoryEvent -> {
                        Assertions
                            .assertThat(eventHistoryEvent)
                            .hasFieldOrPropertyWithValue("event", event)
                            .hasFieldOrPropertyWithValue("action", EventHistoryAction.UPDATE)
                            .hasFieldOrPropertyWithValue("createdBy", Constants.SYSTEM);
                        return true;
                    }
                )
            );
    }

    @Test
    void deleteDoesBroadcastApplicationEvent() {
        Event event = new Event().id(1234L);

        fixture.delete(event);

        verify(publisherMock)
            .publishEvent(
                argThat(
                    eventHistoryEvent -> {
                        Assertions
                            .assertThat(eventHistoryEvent)
                            .hasFieldOrPropertyWithValue("event", event)
                            .hasFieldOrPropertyWithValue("action", EventHistoryAction.DELETE)
                            .hasFieldOrPropertyWithValue("createdBy", Constants.SYSTEM);
                        return true;
                    }
                )
            );
    }
}
