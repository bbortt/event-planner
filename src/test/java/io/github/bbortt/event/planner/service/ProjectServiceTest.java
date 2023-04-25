package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.service.mapper.ProjectMapper;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private Authentication authenticationMock;

    @Mock
    private SecurityContext securityContextMock;

    @Mock
    private ProjectRepository projectRepositoryMock;

    @Mock
    private ProjectMapper projectMapperMock;

    private ProjectService fixture;

    @BeforeEach
    void beforeEachSetup() {
        SecurityContextHolder.setContext(securityContextMock);

        fixture = new ProjectService(projectRepositoryMock, projectMapperMock);
    }

    @AfterEach
    void afterEachTeardown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void constructorRespectsArguments() {
        assertEquals(projectRepositoryMock, ReflectionTestUtils.getField(fixture, "projectRepository"));
        assertEquals(projectMapperMock, ReflectionTestUtils.getField(fixture, "projectMapper"));
    }

    @Test
    void findOneCallsRepository() {
        Long projectId = 1234L;

        Project project = new Project().id(projectId);
        doReturn(Optional.of(project)).when(projectRepositoryMock).findById(projectId);

        ProjectDTO projectDTO = new ProjectDTO();
        doReturn(projectDTO).when(projectMapperMock).toDto(project);

        Optional<ProjectDTO> result = fixture.findOne(projectId);

        assertTrue(result.isPresent());
        assertEquals(projectDTO, result.get());
    }

    @Test
    void findOneByTokenCallsRepository() {
        UUID token = UUID.fromString("e10563fd-26f4-4cd6-98de-f9d92e8f9e73");

        Project project = new Project().id(1234L);
        doReturn(Optional.of(project)).when(projectRepositoryMock).findByToken(token);

        ProjectDTO projectDTO = new ProjectDTO();
        doReturn(projectDTO).when(projectMapperMock).toDto(project);

        Optional<ProjectDTO> result = fixture.findOneByToken(token.toString());

        assertTrue(result.isPresent());
        assertEquals(projectDTO, result.get());
    }

    @Test
    void saveSetsDefaultValues() {
        ProjectDTO projectDTO = new ProjectDTO();
        Project projectMock = mock(Project.class);
        doReturn(projectMock).when(projectMock).token(any(UUID.class));

        doReturn(projectMock).when(projectMapperMock).toEntity(projectDTO);
        doReturn(projectMock).when(projectRepositoryMock).save(projectMock);
        doReturn(projectDTO).when(projectMapperMock).toDto(projectMock);

        ProjectDTO result = fixture.save(projectDTO);

        assertEquals(projectDTO, result);

        verify(projectMock).token(any(UUID.class));
        verify(projectMock).archived(Boolean.FALSE);
        verify(projectRepositoryMock).save(projectMock);
    }

    @Test
    void existsLooksForPersistedEntity() {
        Long projectId = 1234L;

        fixture.exists(projectId);

        verify(projectRepositoryMock).existsById(projectId);
    }

    @Test
    void findAllNotArchivedForCurrentUserReadsCurrentUser() {
        doReturn(authenticationMock).when(securityContextMock).getAuthentication();

        String login = "test-login";
        doReturn(login).when(authenticationMock).getPrincipal();

        ProjectDTO projectDTO = new ProjectDTO();
        Project projectMock = mock(Project.class);

        doReturn(projectDTO).when(projectMapperMock).toDto(projectMock);

        Pageable pageable = Pageable.unpaged();
        doReturn(new SliceImpl<>(List.of(projectMock)))
            .when(projectRepositoryMock)
            .findAllByCreatedByEqualsAndArchivedIsFalse(login, pageable);

        Slice<ProjectDTO> result = fixture.findAllNotArchivedForCurrentUser(pageable);

        assertEquals(1, result.getContent().size());
        assertEquals(projectDTO, result.getContent().get(0));

        verify(projectRepositoryMock).findAllByCreatedByEqualsAndArchivedIsFalse(login, pageable);
    }

    @Test
    void findAllNotArchivedForCurrentUserThrowsExceptionIfNotAuthorized() {
        doReturn(authenticationMock).when(securityContextMock).getAuthentication();

        Pageable pageable = Pageable.unpaged();

        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> fixture.findAllNotArchivedForCurrentUser(pageable)
        );

        assertEquals("Cannot find current user!", exception.getMessage());
        verifyNoInteractions(projectRepositoryMock);
    }
}
