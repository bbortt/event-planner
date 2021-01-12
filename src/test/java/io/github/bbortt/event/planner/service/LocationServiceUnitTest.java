package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.service.exception.BadRequestException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

class LocationServiceUnitTest {

    @Rule
    MockitoRule mockitoRule = MockitoJUnit.rule();

    @Rule
    ExpectedException expectedException = ExpectedException.none();

    @Mock
    ProjectService projectServiceMock;

    @Mock
    SectionService sectionServiceMock;

    @Mock
    EventService eventServiceMock;

    @Mock
    LocationRepository locationRepositoryMock;

    LocationService fixture;

    @Before
    void beforeTestSetup() {
        fixture = new LocationService(projectServiceMock, sectionServiceMock, eventServiceMock, locationRepositoryMock);
    }

    @Test
    void saveDoesAcceptEitherResponsibilityOrUser() {
        Location locationWithUser = new Location().user(new User());
        fixture.save(locationWithUser);

        Location locationWithResponsibility = new Location().responsibility(new Responsibility());
        fixture.save(locationWithResponsibility);

        Location invalidLocation = new Location().user(new User()).responsibility(new Responsibility());

        expectedException.expect(BadRequestException.class);
        fixture.save(invalidLocation);
    }

    @Test
    void deleteDoesTriggerEventsAndSectionDelete() {
        Long locationId = 1234L;

        fixture.delete(locationId);

        Mockito.verify(eventServiceMock).deleteAllByLocationId(locationId);
        Mockito.verify(sectionServiceMock).deleteAllByLocationId(locationId);
        Mockito.verify(locationRepositoryMock).deleteById(locationId);
    }
}
