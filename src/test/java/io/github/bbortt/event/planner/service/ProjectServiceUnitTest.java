package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.*;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.data.domain.Pageable;

class ProjectServiceUnitTest extends AbstractApplicationContextAwareIntegrationTest {

  @Mock
  private ProjectRepository projectRepository;

  private ProjectService fixture;

  @BeforeEach
  public void beforeEachSetup() {
    fixture = new ProjectService(projectRepository);
  }

  void getProjectsReadsAuthenticationContext() {
    Pageable pageable = Pageable.unpaged();

    fixture.getProjects(pageable);

    Mockito.verify(projectRepository).findByAuth0UserIdPaged(null, pageable);
  }
}
