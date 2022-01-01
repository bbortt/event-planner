package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.graphql.dto.ProjectCreateInput;
import io.github.bbortt.event.planner.graphql.dto.ProjectUpdateInput;
import io.github.bbortt.event.planner.service.ProjectService;
import javax.validation.Valid;
import org.springframework.stereotype.Component;

@Component
public class ProjectMutationResolver implements GraphQLMutationResolver {

  private final ProjectService projectService;

  public ProjectMutationResolver(ProjectService projectService) {
    this.projectService = projectService;
  }

  public Project createProject(@Valid ProjectCreateInput projectCreateInput) {
    Project project = new Project(projectCreateInput.getName(), projectCreateInput.getStartDate(), projectCreateInput.getEndDate());
    project.setDescription(projectCreateInput.getDescription());

    return projectService.createProject(project);
  }

  public Project updateProject(@Valid ProjectUpdateInput projectUpdateInput) {
    return projectService.updateProject(
      projectUpdateInput.getId(),
      projectUpdateInput.getName(),
      projectUpdateInput.getDescription(),
      projectUpdateInput.getArchived()
    );
  }
}
