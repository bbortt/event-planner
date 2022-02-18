package io.github.bbortt.event.planner.graphql.resolver;

import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.service.LocalityService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LocalityQueryResolverUnitTest {

  @Mock
  LocalityService localityServiceMock;

  private LocalityQueryResolver fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new LocalityQueryResolver(localityServiceMock);
  }

  @Test
  void listLocalities() {
    Long a = 1234L;
    Optional<Long> b = Optional.of(2345L);

    fixture.listLocalities(a, b);

    verify(localityServiceMock).findAllInProjectByParentLocality(a, b);
  }
}
