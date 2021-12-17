package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.graphql.dto.CreateProjectInput;
import io.github.bbortt.event.planner.graphql.dto.ProjectUpdateInput;
import javax.validation.Valid;
import org.springframework.stereotype.Component;

@Component
public class ProjectMutationResolver implements GraphQLMutationResolver {

  public Project createProject(@Valid CreateProjectInput project) {
    return null;
  }

  public Project updateProject(@Valid ProjectUpdateInput project) {
    return null;
  }
}
