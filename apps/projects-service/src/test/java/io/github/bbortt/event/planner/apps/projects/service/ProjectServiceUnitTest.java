package io.github.bbortt.event.planner.apps.projects.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import io.github.bbortt.event.planner.apps.projects.domain.Member;
import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.domain.repository.ProjectJpaRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;
import javax.persistence.EntityNotFoundException;
import org.apache.http.auth.BasicUserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ProjectServiceUnitTest {

  private static final String AUTH0_USER_ID = "auth0|c6e917e939f8245fcbe14f8c44167d58";

  @Mock
  private PaginationUtils paginationUtils;

  @Mock
  private PermissionService permissionServiceMock;

  @Mock
  private ProjectJpaRepository projectRepositoryMock;

  private ProjectService fixture;

  @BeforeEach
  void beforeEachSetup() {
    TestSecurityContextHolder.setAuthentication(new TestingAuthenticationToken(new BasicUserPrincipal(AUTH0_USER_ID), null));

    fixture = new ProjectService(permissionServiceMock, projectRepositoryMock);
    ReflectionTestUtils.setField(fixture, "paginationUtils", paginationUtils, PaginationUtils.class);
  }

  @Test
  void createProjectCallsRepository() {
    Project newProject = new Project();
    newProject.setStartDate(LocalDate.of(2021, 12, 28));
    newProject.setEndDate(LocalDate.of(2021, 12, 28));

    fixture.createProject(newProject);

    verify(permissionServiceMock).findAll();

    ArgumentCaptor<Project> argumentCaptor = ArgumentCaptor.forClass(Project.class);
    verify(projectRepositoryMock).saveAndFlush(argumentCaptor.capture());
    Project persistedProject = argumentCaptor.getValue();
    assertEquals(1, persistedProject.getMembers().size());

    Member member = new ArrayList<>(persistedProject.getMembers()).get(0);
    assertEquals(AUTH0_USER_ID, member.getAuth0UserId());
    assertEquals(true, member.getAccepted());
    assertEquals(AUTH0_USER_ID, member.getAcceptedBy());
  }

  @Test
  void createProjectRequiresEmptyId() {
    Project newProject = new Project();
    ReflectionTestUtils.setField(newProject, "id", 1234L);

    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> fixture.createProject(newProject));
    assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    assertEquals("New project cannot have an Id!", exception.getReason());
  }

  @Test
  void createProjectCannotEndBeforeItStarts() {
    Project newProject = new Project();
    newProject.setStartDate(LocalDate.of(2021, 12, 28));
    newProject.setEndDate(LocalDate.of(2021, 12, 27));

    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> fixture.createProject(newProject));
    assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    assertEquals("Project cannot end before it starts!", exception.getReason());
  }

  @Test
  void updateProjectCallsRepository() {
    Long id = 1234L;

    Project projectMock = Mockito.mock(Project.class);
    doReturn(Optional.of(projectMock)).when(projectRepositoryMock).findById(id);

    fixture.updateProject(id, null, null, null);

    verifyNoInteractions(projectMock);
    verify(projectRepositoryMock).save(projectMock);
  }

  @Test
  void updateProjectRequiresId() {
    Long id = 1234L;

    doReturn(Optional.empty()).when(projectRepositoryMock).findById(id);

    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> fixture.updateProject(id, null, null, null));
    assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    assertEquals("Project must have an existing Id!", exception.getReason());
  }

  @Test
  void updateProjectName() {
    Long id = 1234L;
    String name = "name";

    Project projectMock = Mockito.mock(Project.class);
    doReturn(Optional.of(projectMock)).when(projectRepositoryMock).findById(id);

    fixture.updateProject(id, name, null, null);

    verify(projectMock).setName(name);
    verify(projectRepositoryMock).save(projectMock);
  }

  @Test
  void updateProjectDescription() {
    Long id = 1234L;
    String description = "description";

    Project projectMock = Mockito.mock(Project.class);
    doReturn(Optional.of(projectMock)).when(projectRepositoryMock).findById(id);

    fixture.updateProject(id, null, description, null);

    verify(projectMock).setDescription(description);
    verify(projectRepositoryMock).save(projectMock);
  }

  @Test
  void archiveProject() {
    Long id = 1234L;
    Boolean archived = Boolean.TRUE;

    Project projectMock = Mockito.mock(Project.class);
    doReturn(Optional.of(projectMock)).when(projectRepositoryMock).findById(id);

    fixture.updateProject(id, null, null, archived);

    verify(projectMock).setArchived(archived);
    verify(projectRepositoryMock).save(projectMock);
  }

  @Test
  void findByIdCallsRepository() {
    Long projectId = 1234L;

    doReturn(Optional.of(new Project())).when(projectRepositoryMock).findById(projectId);

    fixture.findById(projectId);
  }

  @Test
  void findByIdThrowsExceptionIfProjectDoesNotExist() {
    Long projectId = 1234L;

    doReturn(Optional.empty()).when(projectRepositoryMock).findById(projectId);

    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> fixture.findById(projectId));
    assertEquals(HttpStatus.NO_CONTENT, exception.getStatus());
    assertEquals(String.format("Cannot find Project by id '%s'", projectId), exception.getReason());
  }

  @Test
  void findAllNonArchivedProjectsWhichIAmMemberOfReadsAuthenticationContext() {
    Pageable pageable = Pageable.unpaged();
    doReturn(pageable).when(paginationUtils).createPagingInformation(Optional.empty(), Optional.empty(), Optional.empty(), "id");

    fixture.findAllNonArchivedProjectsWhichIAmMemberOf(Optional.empty(), Optional.empty(), Optional.empty());

    verify(projectRepositoryMock).findAllByMemberAndArchivedIsFalse(AUTH0_USER_ID, pageable);
  }
}
