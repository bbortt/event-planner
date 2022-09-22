package io.github.bbortt.event.planner.apps.projects.domain.converter;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.v1.dto.ProjectDto;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class ProjectDtoConverter implements DtoConverter<Project, ProjectDto> {

  @Override
  public Project fromDto(ProjectDto dto) {
    return null;
  }

  @Override
  public ProjectDto toDto(Project project) {
    return new ProjectDto()
      .id(BigDecimal.valueOf(project.getId()))
      .token(project.getToken().toString())
      .name(project.getName())
      .description(project.getDescription())
      .startDate(project.getStartDate())
      .endDate(project.getEndDate());
  }

  @Override
  public List<Project> fromDtos(List<ProjectDto> dtos) {
    return null;
  }

  @Override
  public List<ProjectDto> toDtos(List<Project> projects) {
    return projects.stream().map(this::toDto).collect(Collectors.toList());
  }
}
