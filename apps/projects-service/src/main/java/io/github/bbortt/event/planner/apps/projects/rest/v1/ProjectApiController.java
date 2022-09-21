package io.github.bbortt.event.planner.apps.projects.rest.v1;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.service.ProjectService;
import io.github.bbortt.event.planner.apps.projects.v1.dto.ProjectDto;
import io.github.bbortt.event.planner.apps.projects.v1.dto.ReadProjects200ResponseDto;
import io.github.bbortt.event.planner.apps.projects.v1.rest.ApiUtil;
import io.github.bbortt.event.planner.apps.projects.v1.rest.ProjectApi;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rest")
public class ProjectApiController implements ProjectApi {

  private final ProjectService projectService;

  public ProjectApiController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @Override
  public ResponseEntity<ProjectDto> createProject(ProjectDto projectDto) {
    getRequest()
      .ifPresent(request -> {
        for (MediaType mediaType : MediaType.parseMediaTypes(request.getHeader("Accept"))) {
          if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
            String exampleString =
              "{ \"endDate\" : \"2000-01-23\", \"name\" : \"name\", \"description\" : \"description\", \"id\" : 0.8008281904610115, \"startDate\" : \"2000-01-23\", \"token\" : \"token\" }";
            ApiUtil.setExampleResponse(request, "application/json", exampleString);
            break;
          }
        }
      });
    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @Override
  public ResponseEntity<ReadProjects200ResponseDto> readProjects(
    Optional<BigDecimal> pageSize,
    Optional<BigDecimal> pageNumber,
    Optional<String> sort
  ) {
    ReadProjects200ResponseDto dto = pageTo200ResponseDto(
      projectService.readAllProjects(pageSize.map(BigDecimal::intValueExact), pageNumber.map(BigDecimal::intValueExact), sort)
    );
    return ResponseEntity.ok(dto);
  }

  private ReadProjects200ResponseDto pageTo200ResponseDto(Page<Project> projectPage) {
    return new ReadProjects200ResponseDto()
      .contents(projectPage.getContent().stream().map(this::projectToDto).collect(Collectors.toList()))
      .totalElements(BigDecimal.valueOf(projectPage.getTotalElements()))
      .totalPages(BigDecimal.valueOf(projectPage.getTotalPages()))
      .number(BigDecimal.valueOf(projectPage.getNumber()));
  }

  private ProjectDto projectToDto(Project project) {
    return new ProjectDto()
      .id(BigDecimal.valueOf(project.getId()))
      .token(project.getToken().toString())
      .name(project.getName())
      .description(project.getDescription())
      .startDate(project.getStartDate())
      .endDate(project.getEndDate());
  }
}
