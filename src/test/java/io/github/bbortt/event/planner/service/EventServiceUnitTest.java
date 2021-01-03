package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.EventRepository;
import io.github.bbortt.event.planner.service.exception.BadRequestException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

public class EventServiceUnitTest {

    @Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Mock
    ProjectService projectServiceMock;

    @Mock
    EventRepository eventRepositoryMock;

    EventService fixture;

    @Before
    public void beforeTestSetup() {
        fixture = new EventService(projectServiceMock, eventRepositoryMock);
    }

    @Test
    public void saveDoesAcceptEitherResponsibilityOrUser() {
        Event eventWithUser = new Event().user(new User());
        fixture.save(eventWithUser);

        Event eventWithResponsibility = new Event().responsibility(new Responsibility());
        fixture.save(eventWithResponsibility);

        Event invalidEvent = new Event().user(new User()).responsibility(new Responsibility());

        expectedException.expect(BadRequestException.class);
        fixture.save(invalidEvent);
    }
}
