package io.github.bbortt.event.planner.apps.projects.domain.converter;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.v1.dto.ProjectDto;
import java.math.BigDecimal;
import java.util.List;

public class ProjectDtoConverter implements DtoConverter<Project, ProjectDto> {

  @Override
  public Project fromDto(ProjectDto dto) {
    assert dto != null;
    return new Project(dto.getName(), dto.getDescription(), dto.getStartDate(), dto.getEndDate());
  }

  @Override
  public ProjectDto toDto(Project project) {
    assert project != null;
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
    return dtos.stream().map(this::fromDto).toList();
  }

  @Override
  public List<ProjectDto> toDtos(List<Project> projects) {
    return projects.stream().map(this::toDto).toList();
  }
}
