package io.github.bbortt.event.planner.backend.service;

import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.backend.domain.Location;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.repository.LocationRepository;
import io.github.bbortt.event.planner.backend.service.exception.BadRequestException;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LocationServiceUnitTest {

    @Mock
    ProjectService projectServiceMock;

    @Mock
    LocationRepository locationRepositoryMock;

    LocationService fixture;

    @BeforeEach
    void beforeTestSetup() {
        fixture = new LocationService(projectServiceMock, locationRepositoryMock);
    }

    @Test
    void saveDoesAcceptEitherResponsibilityOrUser() {
        Location locationWithUser = new Location().jhiUserId("test-jhi-user-id");
        fixture.save(locationWithUser);

        Location locationWithResponsibility = new Location().responsibility(new Responsibility());
        fixture.save(locationWithResponsibility);

        Location invalidLocation = new Location().jhiUserId("test-jhi-user-id").responsibility(new Responsibility());

        Assertions.assertThatThrownBy(() -> fixture.save(invalidLocation)).isInstanceOf(BadRequestException.class);
    }

    @Test
    void deleteDoesTriggerEventsAndSectionDelete() {
        Long locationId = 1234L;

        fixture.delete(locationId);

        Mockito.verify(locationRepositoryMock).deleteById(locationId);
    }

    @Test
    void isNameExistingInProject() {
        final Long projectId = 1234L;
        final String name = "test-existing-responsibility-name";

        doReturn(Optional.of(new Responsibility())).when(locationRepositoryMock).findOneByNameAndProjectId(name, projectId);

        Assertions.assertThat(fixture.isNameExistingInProject(projectId, name)).isTrue();

        doReturn(Optional.empty()).when(locationRepositoryMock).findOneByNameAndProjectId(name, projectId);

        Assertions.assertThat(fixture.isNameExistingInProject(projectId, name)).isFalse();
    }
}
