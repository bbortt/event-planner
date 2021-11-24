package io.github.bbortt.event.planner.graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import io.github.bbortt.event.planner.graphql.dto.CreateProjectInput;
import io.github.bbortt.event.planner.graphql.dto.ProjectDTO;
import io.github.bbortt.event.planner.graphql.dto.ProjectUpdateInput;
import javax.validation.Valid;
import org.springframework.stereotype.Component;

@Component
public class ProjectMutationResolver implements GraphQLMutationResolver {

  public ProjectDTO createProject(@Valid CreateProjectInput project) {
    return null;
  }

  public ProjectDTO updateProject(@Valid ProjectUpdateInput project) {
    return null;
  }
}
