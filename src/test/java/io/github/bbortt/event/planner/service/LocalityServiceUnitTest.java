package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.repository.LocalityRepository;
import java.util.Optional;
import javax.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

@ExtendWith(MockitoExtension.class)
class LocalityServiceUnitTest {

  private static final Long PROJECT_ID = 2345L;

  @Mock
  private PermissionService permissionServiceMock;

  @Mock
  private LocalityRepository localityRepositoryMock;

  private LocalityService fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new LocalityService(permissionServiceMock, localityRepositoryMock);
  }

  @Test
  void findAllInProjectByParentLocalityQueriesRepository() {
    Long parentLocalityId = 2345L;
    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(parentLocalityId);

    Long projectId = localityMock.getProject().getId();
    doReturn(true).when(permissionServiceMock).hasProjectPermissions(projectId, "locality:edit");

    fixture.findAllInProjectByParentLocality(Optional.of(projectId), Optional.of(parentLocalityId));

    verify(localityRepositoryMock).findAllByProjectIdEqualsAndParentEquals(projectId, localityMock);
  }

  @Test
  void findAllInProjectByParentLocalityAcceptsEmptyParentLocalityId() {
    Long projectId = 1234L;
    doReturn(true).when(permissionServiceMock).hasProjectPermissions(projectId, "locality:edit");

    fixture.findAllInProjectByParentLocality(Optional.of(projectId), Optional.empty());

    verify(localityRepositoryMock).findAllByProjectIdEqualsAndParentEquals(projectId, null);
  }

  @Test
  void findAllInProjectByParentLocalityAcceptsEmptyProjectId() {
    Long parentLocalityId = 2345L;
    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(parentLocalityId);

    Long projectId = localityMock.getProject().getId();
    doReturn(true).when(permissionServiceMock).hasProjectPermissions(projectId, "locality:edit");

    fixture.findAllInProjectByParentLocality(Optional.empty(), Optional.of(parentLocalityId));

    verify(localityRepositoryMock).findAllByProjectIdEqualsAndParentEquals(projectId, localityMock);
  }

  @Test
  void findAllInProjectByParentLocalityRequiresAtLeastOneArgument() {
    IllegalArgumentException exception = assertThrows(
      IllegalArgumentException.class,
      () -> fixture.findAllInProjectByParentLocality(Optional.empty(), Optional.empty())
    );
    assertEquals("Provide either projectId or parentLocalityId!", exception.getMessage());
  }

  @Test
  void findAllInProjectByParentLocalityThrowsExceptionOnProjectMismatch() {
    Long parentLocalityId = 2345L;
    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(parentLocalityId);

    IllegalArgumentException exception = assertThrows(
      IllegalArgumentException.class,
      () -> fixture.findAllInProjectByParentLocality(Optional.of(3456L), Optional.of(parentLocalityId))
    );
    assertEquals("Something went horribly wrong!", exception.getMessage());
  }

  @Test
  void createLocalityAssignsParent() {
    Locality newLocality = Mockito.mock(Locality.class);
    Long parentLocalityId = 2345L;

    Locality parentLocality = new Locality();
    doReturn(Optional.of(parentLocality)).when(localityRepositoryMock).findById(parentLocalityId);

    fixture.createLocality(newLocality, parentLocalityId);

    verify(localityRepositoryMock).findById(parentLocalityId);
    verify(newLocality).setParent(parentLocality);
  }

  @Test
  void createLocalityThrowsExceptionWithNonExistingParent() {
    Locality newLocality = Mockito.mock(Locality.class);
    Long parentLocalityId = 2345L;

    doReturn(Optional.empty()).when(localityRepositoryMock).findById(parentLocalityId);

    assertThrows(EntityNotFoundException.class, () -> fixture.createLocality(newLocality, parentLocalityId));
  }

  @Test
  void updateLocalityCallsRepository() {
    Long id = 1234L;

    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(id);
    doReturn(Boolean.TRUE).when(permissionServiceMock).hasProjectPermissions(PROJECT_ID, "locality:edit");

    fixture.updateLocality(id, null, null, null);

    verify(localityMock).getProject();
    verifyNoMoreInteractions(localityMock);
    verify(localityRepositoryMock).save(localityMock);
  }

  @Test
  void updateLocalityRequiresId() {
    Long id = 1234L;

    doReturn(Optional.empty()).when(localityRepositoryMock).findById(id);

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> fixture.updateLocality(id, null, null, null));
    assertEquals("Locality must have an existing Id!", exception.getMessage());

    verifyNoInteractions(permissionServiceMock);
  }

  @Test
  void updateLocalityRequiresPermission() {
    Long id = 1234L;

    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(id);

    AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> fixture.updateLocality(id, null, null, null));
    assertEquals("Access is denied", exception.getMessage());

    verify(localityRepositoryMock).findById(id);
    verifyNoMoreInteractions(localityRepositoryMock);
  }

  @Test
  void updateLocalityName() {
    Long id = 1234L;
    String name = "name";

    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(id);
    doReturn(Boolean.TRUE).when(permissionServiceMock).hasProjectPermissions(PROJECT_ID, "locality:edit");

    fixture.updateLocality(id, name, null, null);

    verify(localityMock).setName(name);
    verify(localityRepositoryMock).save(localityMock);
  }

  @Test
  void updateLocalityDescription() {
    Long id = 1234L;
    String description = "description";

    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(id);
    doReturn(Boolean.TRUE).when(permissionServiceMock).hasProjectPermissions(PROJECT_ID, "locality:edit");

    fixture.updateLocality(id, null, description, null);

    verify(localityMock).setDescription(description);
    verify(localityRepositoryMock).save(localityMock);
  }

  @Test
  void updateLocalityParent() {
    Long id = 1234L;
    Long newParentLocalityId = 2345L;

    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(id);
    Locality parentLocalityMock = Mockito.mock(Locality.class);
    doReturn(Optional.of(parentLocalityMock)).when(localityRepositoryMock).findById(newParentLocalityId);
    doReturn(Boolean.TRUE).when(permissionServiceMock).hasProjectPermissions(PROJECT_ID, "locality:edit");

    fixture.updateLocality(id, null, null, newParentLocalityId);

    verify(localityMock).setParent(parentLocalityMock);
    verify(localityRepositoryMock).save(localityMock);
  }

  private Locality smartLocalityMock() {
    Locality localityMock = Mockito.mock(Locality.class);
    Project projectMock = Mockito.mock(Project.class);
    doReturn(PROJECT_ID).when(projectMock).getId();
    doReturn(projectMock).when(localityMock).getProject();
    return localityMock;
  }
}
