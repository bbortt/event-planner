package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.service.mapper.ProjectMapper;
import java.util.UUID;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class ProjectServiceUnitTest {

    @Mock
    private ProjectRepository projectRepositoryMock;

    @Mock
    private ProjectMapper projectMapperMock;

    private ProjectService fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new ProjectService(projectRepositoryMock, projectMapperMock);
    }

    @Test
    void constructorRespectsArguments() {
        assertEquals(projectRepositoryMock, ReflectionTestUtils.getField(fixture, "projectRepository"));
        assertEquals(projectMapperMock, ReflectionTestUtils.getField(fixture, "projectMapper"));
    }

    @Test
    void saveSetsDefaultValues() {
        ProjectDTO projectDTO = new ProjectDTO();
        Project projectMock = Mockito.mock(Project.class);

        doReturn(projectMock).when(projectMapperMock).toEntity(projectDTO);
        doReturn(projectMock).when(projectRepositoryMock).save(projectMock);

        fixture.save(projectDTO);

        verify(projectMock).token(any(UUID.class)).archived(eq(Boolean.FALSE));
        verify(projectRepositoryMock).save(projectMock);
    }
}
