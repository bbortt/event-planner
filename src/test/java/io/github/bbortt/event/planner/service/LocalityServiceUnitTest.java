package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
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

  @Mock
  private PermissionService permissionServiceMock;

  @Mock
  private ProjectService projectServiceMock;

  @Mock
  private LocalityRepository localityRepositoryMock;

  private LocalityService fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new LocalityService(permissionServiceMock, projectServiceMock, localityRepositoryMock);
  }

  @Test
  void createLocalityAssignsProject() {
    Long projectId = 1234L;
    Locality newLocality = Mockito.mock(Locality.class);

    Project project = new Project();
    doReturn(Optional.of(project)).when(projectServiceMock).findById(projectId);

    fixture.createLocality(projectId, newLocality);

    verify(projectServiceMock).findById(projectId);
    verify(newLocality).setProject(project);

    verify(localityRepositoryMock).save(newLocality);
  }

  @Test
  void createLocalityThrowsExceptionWhenProjectDoesNotExist() {
    Long projectId = 1234L;
    Locality newLocality = Mockito.mock(Locality.class);

    doReturn(Optional.empty()).when(projectServiceMock).findById(projectId);

    assertThrows(IllegalArgumentException.class, () -> fixture.createLocality(projectId, newLocality));
  }

  @Test
  void createLocalityAssignsParent() {
    Long projectId = 1234L;
    Locality newLocality = Mockito.mock(Locality.class);
    Long parentLocalityId = 2345L;

    Locality parentLocality = new Locality();
    doReturn(Optional.of(parentLocality)).when(localityRepositoryMock).findById(parentLocalityId);

    Project project = new Project();
    doReturn(Optional.of(project)).when(projectServiceMock).findById(projectId);

    fixture.createLocality(projectId, newLocality, parentLocalityId);

    verify(localityRepositoryMock).findById(parentLocalityId);
    verify(newLocality).setParent(parentLocality);
  }

  @Test
  void createLocalityThrowsExceptionWithNonExistingParent() {
    Long projectId = 1234L;
    Locality newLocality = Mockito.mock(Locality.class);
    Long parentLocalityId = 2345L;

    doReturn(Optional.empty()).when(localityRepositoryMock).findById(parentLocalityId);

    assertThrows(EntityNotFoundException.class, () -> fixture.createLocality(projectId, newLocality, parentLocalityId));
  }

  @Test
  void updateLocalityCallsRepository() {
    Long id = 1234L;

    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(id);
    doReturn(true).when(permissionServiceMock).hasProjectPermissions(anyLong(), eq("locality:edit"));

    fixture.updateLocality(id, null, null);

    verify(localityMock).getProject();
    verifyNoMoreInteractions(localityMock);
    verify(localityRepositoryMock).save(localityMock);
  }

  @Test
  void updateLocalityRequiresId() {
    Long id = 1234L;

    doReturn(Optional.empty()).when(localityRepositoryMock).findById(id);

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> fixture.updateLocality(id, null, null));

    assertEquals("Locality must have an existing Id!", exception.getMessage());
    verifyNoInteractions(permissionServiceMock);
  }

  @Test
  void updateLocalityRequiresPermission() {
    Long id = 1234L;

    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(id);

    AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> fixture.updateLocality(id, null, null));

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
    doReturn(true).when(permissionServiceMock).hasProjectPermissions(anyLong(), eq("locality:edit"));

    fixture.updateLocality(id, name, null);

    verify(localityMock).setName(name);
    verify(localityRepositoryMock).save(localityMock);
  }

  @Test
  void updateLocalityDescription() {
    Long id = 1234L;
    String description = "description";

    Locality localityMock = smartLocalityMock();
    doReturn(Optional.of(localityMock)).when(localityRepositoryMock).findById(id);
    doReturn(true).when(permissionServiceMock).hasProjectPermissions(anyLong(), eq("locality:edit"));

    fixture.updateLocality(id, null, description);

    verify(localityMock).setDescription(description);
    verify(localityRepositoryMock).save(localityMock);
  }

  private Locality smartLocalityMock() {
    Locality localityMock = Mockito.mock(Locality.class);
    Project projectMock = Mockito.mock(Project.class);
    doReturn(2345L).when(projectMock).getId();
    doReturn(projectMock).when(localityMock).getProject();
    return localityMock;
  }
}
