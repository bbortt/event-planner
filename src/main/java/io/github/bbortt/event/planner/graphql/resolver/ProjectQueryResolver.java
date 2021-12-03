package io.github.bbortt.event.planner.graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.graphql.dto.ProjectDTO;
import io.github.bbortt.event.planner.service.ProjectService;
import java.util.Optional;
import java.util.Set;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class ProjectQueryResolver implements GraphQLQueryResolver {

  private final ModelMapper modelMapper;
  private final ProjectService projectService;

  public ProjectQueryResolver(ModelMapper modelMapper, ProjectService projectService) {
    this.modelMapper = modelMapper;
    this.projectService = projectService;
  }

  public Set<ProjectDTO> listProjects(Optional<Integer> count, Optional<Integer> offset) {
    Pageable pageable;

    if (count.isPresent() && offset.isPresent()) {
      pageable = PageRequest.of(offset.get(), count.get());
    } else {
      pageable = Pageable.unpaged();
    }

    return projectService.getProjects(pageable).map(this::toDto).toSet();
  }

  private ProjectDTO toDto(Project project) {
    return modelMapper.map(project, ProjectDTO.class);
  }
}
