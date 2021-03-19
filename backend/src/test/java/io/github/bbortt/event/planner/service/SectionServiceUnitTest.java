package io.github.bbortt.section.planner.service;

import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.domain.Section;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.SectionRepository;
import io.github.bbortt.event.planner.service.EventService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.SectionService;
import io.github.bbortt.event.planner.service.exception.BadRequestException;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

class SectionServiceUnitTest {
    @Rule
    MockitoRule mockitoRule = MockitoJUnit.rule();

    @Rule
    ExpectedException expectedException = ExpectedException.none();

    @Mock
    ProjectService projectServiceMock;

    @Mock
    EventService eventServiceMock;

    @Mock
    SectionRepository sectionRepositoryMock;

    SectionService fixture;

    @Before
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

        expectedException.expect(BadRequestException.class);
        fixture.save(invalidSection);
    }

    @Test
    void deleteDoesTriggerEventsDelete() {
        Long sectionId = 1234L;

        fixture.delete(1234L);

        Mockito.verify(eventServiceMock).deleteAllBySectionId(sectionId);
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
