package io.github.bbortt.section.planner.service;

import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.domain.Section;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.SectionRepository;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.SectionService;
import io.github.bbortt.event.planner.service.exception.BadRequestException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

public class SectionServiceUnitTest {

    @Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Mock
    ProjectService projectServiceMock;

    @Mock
    SectionRepository sectionRepositoryMock;

    SectionService fixture;

    @Before
    public void beforeTestSetup() {
        fixture = new SectionService(projectServiceMock, sectionRepositoryMock);
    }

    @Test
    public void saveDoesAcceptEitherResponsibilityOrUser() {
        Section sectionWithUser = new Section().user(new User());
        fixture.save(sectionWithUser);

        Section sectionWithResponsibility = new Section().responsibility(new Responsibility());
        fixture.save(sectionWithResponsibility);

        Section invalidSection = new Section().user(new User()).responsibility(new Responsibility());

        expectedException.expect(BadRequestException.class);
        fixture.save(invalidSection);
    }
}
