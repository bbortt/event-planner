package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.EventRepository;
import io.github.bbortt.event.planner.repository.SectionRepository;
import io.github.bbortt.event.planner.service.exception.BadRequestException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

class EventServiceUnitTest {
    @Rule
    MockitoRule mockitoRule = MockitoJUnit.rule();

    @Rule
    ExpectedException expectedException = ExpectedException.none();

    @Mock
    ProjectService projectServiceMock;

    @Mock
    SectionRepository sectionRepositoryMock;

    @Mock
    EventRepository eventRepositoryMock;

    EventService fixture;

    @Before
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

        expectedException.expect(BadRequestException.class);
        fixture.save(invalidEvent);
    }
}
