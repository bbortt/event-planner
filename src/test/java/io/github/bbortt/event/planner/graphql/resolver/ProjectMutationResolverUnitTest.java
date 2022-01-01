package io.github.bbortt.event.planner.graphql.resolver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.graphql.dto.ProjectCreateInput;
import io.github.bbortt.event.planner.graphql.dto.ProjectUpdateInput;
import io.github.bbortt.event.planner.service.ProjectService;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProjectMutationResolverUnitTest {

  @Mock
  private ProjectService projectServiceMock;

  private ProjectMutationResolver fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new ProjectMutationResolver(projectServiceMock);
  }

  @Test
  void createProject() {
    ProjectCreateInput projectCreateInput = new ProjectCreateInput();
    projectCreateInput.setName("name");
    projectCreateInput.setDescription("description");
    projectCreateInput.setStartDate(LocalDate.of(2021, 12, 28));
    projectCreateInput.setEndDate(LocalDate.of(2021, 12, 29));

    fixture.createProject(projectCreateInput);

    ArgumentCaptor<Project> argumentCaptor = ArgumentCaptor.forClass(Project.class);
    verify(projectServiceMock).createProject(argumentCaptor.capture());
    Project project = argumentCaptor.getValue();
    assertEquals(projectCreateInput.getName(), project.getName());
    assertEquals(projectCreateInput.getDescription(), project.getDescription());
    assertEquals(projectCreateInput.getStartDate(), project.getStartDate());
    assertEquals(projectCreateInput.getEndDate(), project.getEndDate());
  }

  @Test
  void updateProject() {
    ProjectUpdateInput projectUpdateInput = new ProjectUpdateInput();
    projectUpdateInput.setId(1234L);
    projectUpdateInput.setName("name");
    projectUpdateInput.setDescription("description");
    projectUpdateInput.setArchived(Boolean.TRUE);

    fixture.updateProject(projectUpdateInput);

    verify(projectServiceMock)
      .updateProject(
        projectUpdateInput.getId(),
        projectUpdateInput.getName(),
        projectUpdateInput.getDescription(),
        projectUpdateInput.getArchived()
      );
  }
}
