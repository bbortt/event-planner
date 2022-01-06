package io.github.bbortt.event.planner.graphql.resolver;

import graphql.kickstart.tools.GraphQLQueryResolver;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.ProjectService;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class ProjectQueryResolver implements GraphQLQueryResolver {

  private final ProjectService projectService;

  public ProjectQueryResolver(ProjectService projectService) {
    this.projectService = projectService;
  }

  public Set<Project> listProjects(Optional<Integer> count, Optional<Integer> offset) {
    Pageable pageable;

    if (count.isPresent() && offset.isPresent()) {
      pageable = PageRequest.of(offset.get(), count.get());
    } else {
      pageable = Pageable.unpaged();
    }

    return projectService.findAll(pageable).toSet();
  }
}
