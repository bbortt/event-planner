package io.github.bbortt.event.planner.backend.service;

import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.repository.ResponsibilityRepository;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ResponsibilityServiceUnitTest {

    @Mock
    ProjectService projectServiceMock;

    @Mock
    ResponsibilityRepository responsibilityRepositoryMock;

    ResponsibilityService fixture;

    @BeforeEach
    public void beforeTestSetup() {
        fixture = new ResponsibilityService(projectServiceMock, responsibilityRepositoryMock);
    }

    @Test
    void isNameExistingInProject() {
        final Long projectId = 1234L;
        final String name = "test-existing-responsibility-name";

        doReturn(Optional.of(new Responsibility())).when(responsibilityRepositoryMock).findOneByNameAndProjectId(name, projectId);

        Assertions.assertThat(fixture.isNameExistingInProject(projectId, name)).isTrue();

        doReturn(Optional.empty()).when(responsibilityRepositoryMock).findOneByNameAndProjectId(name, projectId);

        Assertions.assertThat(fixture.isNameExistingInProject(projectId, name)).isFalse();
    }
}
