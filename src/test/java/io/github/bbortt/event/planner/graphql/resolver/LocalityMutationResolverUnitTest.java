package io.github.bbortt.event.planner.graphql.resolver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.graphql.dto.LocalityCreateInput;
import io.github.bbortt.event.planner.service.LocalityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LocalityMutationResolverUnitTest {

  @Mock
  private LocalityService localityServiceMock;

  private LocalityMutationResolver fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new LocalityMutationResolver(localityServiceMock);
  }

  @Test
  void createLocalityWithoutParent() {
    Long projectId = 1234L;

    LocalityCreateInput localityCreateInput = new LocalityCreateInput();
    localityCreateInput.setName("name");
    localityCreateInput.setDescription("description");

    fixture.createLocality(projectId, localityCreateInput);

    ArgumentCaptor<Locality> argumentCaptor = ArgumentCaptor.forClass(Locality.class);
    verify(localityServiceMock).createLocality(eq(projectId), argumentCaptor.capture());
    Locality locality = argumentCaptor.getValue();
    assertEquals(localityCreateInput.getName(), locality.getName());
    assertEquals(localityCreateInput.getDescription(), locality.getDescription());
  }

  @Test
  void createLocalityWithParent() {
    Long projectId = 1234L;
    Long parentLocalityId = 2345L;

    LocalityCreateInput localityCreateInput = new LocalityCreateInput();
    localityCreateInput.setName("name");
    localityCreateInput.setDescription("description");
    localityCreateInput.setParentLocalityId(parentLocalityId);

    fixture.createLocality(projectId, localityCreateInput);

    ArgumentCaptor<Locality> argumentCaptor = ArgumentCaptor.forClass(Locality.class);
    verify(localityServiceMock).createLocality(eq(projectId), argumentCaptor.capture(), eq(parentLocalityId));
    Locality locality = argumentCaptor.getValue();
    assertEquals(localityCreateInput.getName(), locality.getName());
    assertEquals(localityCreateInput.getDescription(), locality.getDescription());
  }
}
