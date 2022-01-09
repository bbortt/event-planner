package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

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
}
