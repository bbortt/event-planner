package io.github.bbortt.event.planner.service;

import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.repository.ResponsibilityRepository;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

class ResponsibilityServiceUnitTest {

    @Rule
    MockitoRule mockitoRule = MockitoJUnit.rule();

    @Mock
    ProjectService projectServiceMock;

    @Mock
    ResponsibilityRepository responsibilityRepositoryMock;

    ResponsibilityService fixture;

    @Before
    public void beforeTestSetup() {
        fixture = new ResponsibilityService(projectServiceMock, responsibilityRepositoryMock);
    }

    @Test
    void isNameExistingInProject() {
        final Long projectId = 1234L;
        final String name = "text-existing-responsibility-name";

        doReturn(Optional.of(new Responsibility())).when(responsibilityRepositoryMock).findOneByNameAndProjectId(name, projectId);

        Assertions.assertThat(fixture.isNameExistingInProject(projectId, name)).isTrue();

        doReturn(Optional.empty()).when(responsibilityRepositoryMock).findOneByNameAndProjectId(name, projectId);

        Assertions.assertThat(fixture.isNameExistingInProject(projectId, name)).isFalse();
    }
}
