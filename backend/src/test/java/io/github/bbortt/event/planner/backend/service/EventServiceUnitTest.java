package io.github.bbortt.event.planner.backend.service;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.backend.config.Constants;
import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import io.github.bbortt.event.planner.backend.domain.Location;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.repository.EventRepository;
import io.github.bbortt.event.planner.backend.service.exception.BadRequestException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
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

    Project project;
    Event event;

    EventService fixture;

    @BeforeEach
    void beforeTestSetup() {
        project =
            new Project()
                .startTime(ZonedDateTime.of(2021, 6, 23, 8, 0, 0, 0, ZoneId.systemDefault()))
                .endTime(ZonedDateTime.of(2021, 6, 24, 8, 0, 0, 0, ZoneId.systemDefault()));
        Location location = new Location().project(project);
        Section section = new Section().location(location);
        event = new Event().startTime(project.getStartTime()).endTime(project.getEndTime()).section(section);

        fixture = new EventService(publisherMock, projectServiceMock, eventRepositoryMock);
    }

    @Test
    void saveDoesAcceptEitherResponsibilityOrUser() {
        event.jhiUserId("test-jhi-user-id");
        fixture.save(event);

        event.jhiUserId(null).responsibility(new Responsibility());
        fixture.save(event);

        event.jhiUserId("test-jhi-user-id").responsibility(new Responsibility());

        Assertions.assertThatThrownBy(() -> fixture.save(event)).isInstanceOf(BadRequestException.class);
    }

    @Test
    public void saveDoesNotAcceptStartTimeOutOfBounds() {
        event.startTime(project.getStartTime().minus(1, ChronoUnit.MINUTES));

        Assertions.assertThatThrownBy(() -> fixture.save(event)).isInstanceOf(BadRequestException.class);
    }

    @Test
    public void saveDoesNotAcceptEndTimeOutOfBounds() {
        event.endTime(project.getEndTime().plus(1, ChronoUnit.MINUTES));

        Assertions.assertThatThrownBy(() -> fixture.save(event)).isInstanceOf(BadRequestException.class);
    }

    @Test
    void saveDoesBroadcastApplicationEvent() {
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
        event.id(1234L);

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
        event.id(1234L);

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
