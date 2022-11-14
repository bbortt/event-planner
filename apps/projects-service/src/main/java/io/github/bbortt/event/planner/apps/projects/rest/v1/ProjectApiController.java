package io.github.bbortt.event.planner.apps.projects.rest.v1;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.domain.converter.DtoConverter;
import io.github.bbortt.event.planner.apps.projects.domain.converter.ProjectDtoConverter;
import io.github.bbortt.event.planner.apps.projects.service.ProjectService;
import io.github.bbortt.event.planner.apps.projects.v1.dto.ProjectDto;
import io.github.bbortt.event.planner.apps.projects.v1.dto.ReadProjects200ResponseDto;
import io.github.bbortt.event.planner.apps.projects.v1.rest.ProjectApi;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectApiController implements ProjectApi {

  private final ProjectService projectService;
  private final DtoConverter<Project, ProjectDto> projectDtoConverter;

  public ProjectApiController(ProjectService projectService) {
    this.projectService = projectService;

    this.projectDtoConverter = new ProjectDtoConverter();
  }

  @Override
  public ResponseEntity<ProjectDto> createProject(ProjectDto projectDto) {
    Project project = projectService.createProject(projectDtoConverter.fromDto(projectDto));
    return ResponseEntity.status(HttpStatus.CREATED).body(projectDtoConverter.toDto(project));
  }

  @Override
  public ResponseEntity<ProjectDto> readProjectById(Long projectId) {
    return ResponseEntity.ok(projectDtoConverter.toDto(projectService.findById(projectId)));
  }

  @Override
  public ResponseEntity<ReadProjects200ResponseDto> readProjects(
    Optional<Integer> pageSize,
    Optional<Integer> pageNumber,
    Optional<String> sort
  ) {
    ReadProjects200ResponseDto dto = pageTo200ResponseDto(
      projectService.findAllNonArchivedProjectsWhichIAmMemberOf(pageSize, pageNumber, sort)
    );
    return ResponseEntity.ok(dto);
  }

  private ReadProjects200ResponseDto pageTo200ResponseDto(Page<Project> projectPage) {
    return new ReadProjects200ResponseDto()
      .contents(projectDtoConverter.toDtos(projectPage.getContent()))
      .totalElements(projectPage.getTotalElements())
      .totalPages(projectPage.getTotalPages())
      .number(projectPage.getNumber());
  }
}
