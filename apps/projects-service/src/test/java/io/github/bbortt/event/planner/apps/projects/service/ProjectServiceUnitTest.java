package io.github.bbortt.event.planner.apps.projects.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.domain.repository.ProjectJpaRepository;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.ProjectApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.dto.ReadProjectIdsByMembership200ResponseDto;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.apache.http.auth.BasicUserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
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
  private MemberService memberServiceMock;

  @Mock
  private ProjectApi projectApiMock;

  @Mock
  private ProjectJpaRepository projectRepositoryMock;

  private ProjectService fixture;

  @BeforeEach
  void beforeEachSetup() {
    TestSecurityContextHolder.setAuthentication(new TestingAuthenticationToken(new BasicUserPrincipal(AUTH0_USER_ID), null));

    fixture = new ProjectService(memberServiceMock, projectApiMock, projectRepositoryMock);
    ReflectionTestUtils.setField(fixture, "paginationUtils", paginationUtils, PaginationUtils.class);
  }

  @Test
  void createProjectCallsRepository() {
    Project newProject = new Project();
    newProject.setStartDate(LocalDate.of(2021, 12, 28));
    newProject.setEndDate(LocalDate.of(2021, 12, 28));

    doAnswer(invocation -> {
        Project projectToPersist = invocation.getArgument(0);
        ReflectionTestUtils.setField(projectToPersist, "id", 1L);
        return projectToPersist;
      })
      .when(projectRepositoryMock)
      .saveAndFlush(newProject);

    Project result = fixture.createProject(newProject);
    assertEquals(1L, result.getId());

    verify(memberServiceMock).createAdminMember(AUTH0_USER_ID, result);
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

    Project project = new Project();
    doReturn(Optional.of(project)).when(projectRepositoryMock).findById(projectId);

    Project result = fixture.findById(projectId);

    assertEquals(project, result);

    verify(projectRepositoryMock).findById(projectId);
  }

  @Test
  void findByIdThrowsExceptionIfProjectDoesNotExist() {
    Long projectId = 1234L;

    doReturn(Optional.empty()).when(projectRepositoryMock).findById(projectId);

    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> fixture.findById(projectId));
    assertEquals(HttpStatus.NO_CONTENT, exception.getStatus());
    assertEquals(String.format("Cannot find Project by id '%s'", projectId), exception.getReason());

    verify(projectRepositoryMock).findById(projectId);
  }

  @Test
  void findAllNonArchivedProjectsWhichIAmMemberOfReadsAuthenticationContext() {
    List<Long> projectIds = List.of(1L);

    Pageable pageable = Pageable.unpaged();
    doReturn(pageable).when(paginationUtils).createPagingInformation(Optional.empty(), Optional.empty(), Optional.empty(), "id");

    doReturn(new ReadProjectIdsByMembership200ResponseDto().contents(projectIds))
      .when(projectApiMock)
      .readProjectIdsByMembership(AUTH0_USER_ID);

    Page emptyPage = Page.empty();
    doReturn(emptyPage).when(projectRepositoryMock).findAllByIdAndArchivedIsFalse(projectIds, pageable);

    Page result = fixture.findAllNonArchivedProjectsWhichIAmMemberOf(Optional.empty(), Optional.empty(), Optional.empty());

    assertEquals(emptyPage, result);
  }
}
