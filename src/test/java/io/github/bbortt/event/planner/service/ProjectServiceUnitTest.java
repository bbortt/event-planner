package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.apache.http.auth.BasicUserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class ProjectServiceUnitTest {

  @Mock
  private ProjectRepository projectRepositoryMock;

  private ProjectService fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new ProjectService(projectRepositoryMock);
  }

  @Test
  void getProjectsReadsAuthenticationContext() {
    String sub = "auth0|ljasd7fgh278hsdfk2h34k2l";
    TestSecurityContextHolder.setAuthentication(new TestingAuthenticationToken(new BasicUserPrincipal(sub), null));

    Pageable pageable = Pageable.unpaged();

    fixture.getProjects(pageable);

    verify(projectRepositoryMock).findByAuth0UserIdPaged(sub, pageable);
  }

  @Test
  void createProjectCallsRepository() {
    Project newProject = new Project();
    newProject.setStartTime(ZonedDateTime.of(2021, 12, 28, 9, 0, 0, 0, ZoneId.systemDefault()));
    newProject.setEndTime(ZonedDateTime.of(2021, 12, 29, 9, 0, 0, 0, ZoneId.systemDefault()));

    fixture.createProject(newProject);

    verify(projectRepositoryMock).save(newProject);
  }

  @Test
  void createProjectRequiresEmptyID() {
    Project newProject = new Project();
    ReflectionTestUtils.setField(newProject, "id", 1234L);

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> fixture.createProject(newProject));

    assertEquals("New project cannot have an ID!", exception.getMessage());
  }

  @Test
  void createProjectCannotEndBeforeItStarts() {
    Project newProject = new Project();
    newProject.setStartTime(ZonedDateTime.of(2021, 12, 28, 9, 0, 0, 0, ZoneId.systemDefault()));
    newProject.setEndTime(ZonedDateTime.of(2021, 12, 27, 9, 0, 0, 0, ZoneId.systemDefault()));

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> fixture.createProject(newProject));

    assertEquals("Project cannot end before it starts!", exception.getMessage());
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
  void updateProjectRequiresID() {
    Long id = 1234L;

    doReturn(Optional.empty()).when(projectRepositoryMock).findById(id);

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> fixture.updateProject(id, null, null, null));

    assertEquals("Project must have an existing ID!", exception.getMessage());
  }

  @Test
  void updateProjectWithAllProperties() {
    Long id = 1234L;
    String name = "name";
    String description = "description";
    Boolean archived = Boolean.TRUE;

    Project projectMock = Mockito.mock(Project.class);
    doReturn(Optional.of(projectMock)).when(projectRepositoryMock).findById(id);

    fixture.updateProject(id, name, description, archived);

    verify(projectMock).setName(name);
    verify(projectMock).setDescription(description);
    verify(projectMock).setArchived(archived);
    verify(projectRepositoryMock).save(projectMock);
  }
}
