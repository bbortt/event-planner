package io.github.bbortt.event.planner.graphql.resolver;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.ProjectService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class ProjectQueryResolverUnitTest {

  @Mock
  private ProjectService projectServiceMock;

  private ProjectQueryResolver fixture;

  @BeforeEach
  void beforeEachSetup() {
    Project project = new Project();

    doReturn(new PageImpl(List.of(project))).when(projectServiceMock).getProjects(any(Pageable.class));

    fixture = new ProjectQueryResolver(projectServiceMock);
  }

  @Test
  void listProjectsWithPageable() {
    int count = 1;
    int offset = 2;

    fixture.listProjects(Optional.of(count), Optional.of(offset));

    verify(projectServiceMock).getProjects(PageRequest.of(offset, count));
  }

  @Test
  void listProjectsUnpaged() {
    int count = 1;
    int offset = 2;

    fixture.listProjects(Optional.of(count), Optional.empty());
    fixture.listProjects(Optional.empty(), Optional.of(offset));
    fixture.listProjects(Optional.empty(), Optional.empty());

    verify(projectServiceMock, times(3)).getProjects(Pageable.unpaged());
  }
}
