package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.domain.User;
import io.github.bbortt.event.planner.backend.repository.EventRepository;
import io.github.bbortt.event.planner.backend.repository.SectionRepository;
import io.github.bbortt.event.planner.backend.service.exception.BadRequestException;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventServiceUnitTest {

    @Mock
    ProjectService projectServiceMock;

    @Mock
    SectionRepository sectionRepositoryMock;

    @Mock
    EventRepository eventRepositoryMock;

    EventService fixture;

    @BeforeEach
    void beforeTestSetup() {
        fixture = new EventService(projectServiceMock, sectionRepositoryMock, eventRepositoryMock);
    }

    @Test
    void saveDoesAcceptEitherResponsibilityOrUser() {
        Event eventWithUser = new Event().user(new User());
        fixture.save(eventWithUser);

        Event eventWithResponsibility = new Event().responsibility(new Responsibility());
        fixture.save(eventWithResponsibility);

        Event invalidEvent = new Event().user(new User()).responsibility(new Responsibility());

        Assertions.assertThatThrownBy(() -> fixture.save(invalidEvent))
            .isInstanceOf(BadRequestException.class);
    }
}
