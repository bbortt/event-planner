package io.github.bbortt.event.planner.apps.projects.service;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.domain.repository.ProjectJpaRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Lazy
@Service
public class ProjectService {

  private static final String PROJECT_ID_ATTRIBUTE_NAME = "id";

  private final ProjectJpaRepository projectRepository;

  public ProjectService(ProjectJpaRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public Page<Project> readAllProjects(Optional<Integer> pageSize, Optional<Integer> pageNumber, Optional<String> sort) {
    return projectRepository.findAllByArchivedIsFalse(
      PaginationUtils.createPagingInformation(pageSize, pageNumber, sort, PROJECT_ID_ATTRIBUTE_NAME)
    );
  }
}
