package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.repository.ProjectRepository;
import java.security.Principal;
import org.apache.http.auth.BasicUserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.TestSecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class ProjectServiceUnitTest {

  @Mock
  private ProjectRepository projectRepository;

  private ProjectService fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new ProjectService(projectRepository);
  }

  @Test
  void getProjectsReadsAuthenticationContext() {
    String sub = "auth0|ljasd7fgh278hsdfk2h34k2l";
    TestSecurityContextHolder.setAuthentication(new TestingAuthenticationToken(new BasicUserPrincipal(sub), null));

    Pageable pageable = Pageable.unpaged();

    fixture.getProjects(pageable);

    Mockito.verify(projectRepository).findByAuth0UserIdPaged(sub, pageable);
  }
}
