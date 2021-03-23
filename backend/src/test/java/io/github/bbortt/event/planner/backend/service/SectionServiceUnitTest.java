package io.github.bbortt.event.planner.backend.service;

import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.domain.User;
import io.github.bbortt.event.planner.backend.repository.SectionRepository;
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
class SectionServiceUnitTest {

    @Mock
    ProjectService projectServiceMock;

    @Mock
    EventService eventServiceMock;

    @Mock
    SectionRepository sectionRepositoryMock;

    SectionService fixture;

    @BeforeEach
    void beforeTestSetup() {
        fixture = new SectionService(projectServiceMock, eventServiceMock, sectionRepositoryMock);
    }

    @Test
    void saveDoesAcceptEitherResponsibilityOrUser() {
        Section sectionWithUser = new Section().user(new User());
        fixture.save(sectionWithUser);

        Section sectionWithResponsibility = new Section().responsibility(new Responsibility());
        fixture.save(sectionWithResponsibility);

        Section invalidSection = new Section().user(new User()).responsibility(new Responsibility());

        Assertions.assertThatThrownBy(() -> fixture.save(invalidSection)).isInstanceOf(BadRequestException.class);
    }

    @Test
    void deleteDoesTriggerEventsDelete() {
        Long sectionId = 1234L;

        fixture.delete(1234L);

        Mockito.verify(sectionRepositoryMock).deleteById(sectionId);
    }

    @Test
    void isNameExistingInProject() {
        final Long locationId = 1234L;
        final String name = "test-existing-responsibility-name";

        doReturn(Optional.of(new Responsibility())).when(sectionRepositoryMock).findOneByNameAndLocationId(name, locationId);

        Assertions.assertThat(fixture.isNameExistingInLocation(locationId, name)).isTrue();

        doReturn(Optional.empty()).when(sectionRepositoryMock).findOneByNameAndLocationId(name, locationId);

        Assertions.assertThat(fixture.isNameExistingInLocation(locationId, name)).isFalse();
    }
}
