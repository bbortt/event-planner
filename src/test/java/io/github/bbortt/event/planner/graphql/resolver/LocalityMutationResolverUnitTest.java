package io.github.bbortt.event.planner.graphql.resolver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.graphql.dto.LocalityCreateInput;
import io.github.bbortt.event.planner.service.LocalityService;
import io.github.bbortt.event.planner.service.ProjectService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LocalityMutationResolverUnitTest {

  @Mock
  private LocalityService localityServiceMock;

  @Mock
  private ProjectService projectServiceMock;

  private LocalityMutationResolver fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new LocalityMutationResolver(localityServiceMock, projectServiceMock);
  }

  @Test
  void createLocalityWithoutParent() {
    Long projectId = 1234L;

    Project project = new Project();
    doReturn(project).when(projectServiceMock).findById(projectId);

    LocalityCreateInput localityCreateInput = new LocalityCreateInput();
    localityCreateInput.setName("name");
    localityCreateInput.setDescription("description");

    fixture.createLocality(projectId, localityCreateInput);

    ArgumentCaptor<Locality> argumentCaptor = ArgumentCaptor.forClass(Locality.class);
    verify(localityServiceMock).createLocality(argumentCaptor.capture());
    Locality locality = argumentCaptor.getValue();
    assertEquals(localityCreateInput.getName(), locality.getName());
    assertEquals(localityCreateInput.getDescription(), locality.getDescription());
    assertEquals(project, locality.getProject());
  }

  @Test
  void createLocalityWithParent() {
    Long projectId = 1234L;
    Long parentLocalityId = 2345L;

    Project project = new Project();
    doReturn(project).when(projectServiceMock).findById(projectId);

    LocalityCreateInput localityCreateInput = new LocalityCreateInput();
    localityCreateInput.setName("name");
    localityCreateInput.setDescription("description");
    localityCreateInput.setParentLocalityId(parentLocalityId);

    fixture.createLocality(projectId, localityCreateInput);

    ArgumentCaptor<Locality> argumentCaptor = ArgumentCaptor.forClass(Locality.class);
    verify(localityServiceMock).createLocality(argumentCaptor.capture(), eq(parentLocalityId));
    Locality locality = argumentCaptor.getValue();
    assertEquals(localityCreateInput.getName(), locality.getName());
    assertEquals(localityCreateInput.getDescription(), locality.getDescription());
    assertEquals(project, locality.getProject());
  }
}
