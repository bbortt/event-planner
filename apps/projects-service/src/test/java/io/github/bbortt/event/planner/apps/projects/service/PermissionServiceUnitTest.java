package io.github.bbortt.event.planner.apps.projects.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.apps.projects.domain.repository.PermissionJpaRepository;
import java.util.List;
import org.apache.http.auth.BasicUserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.test.context.TestSecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class PermissionServiceUnitTest {

  @Mock
  private PermissionJpaRepository permissionRepositoryMock;

  private PermissionService fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new PermissionService(permissionRepositoryMock);
  }

  @Test
  void findAllQueriesRepository() {
    fixture.findAll();
    verify(permissionRepositoryMock).findAll();
  }

  @Test
  void hasProjectPermissionsQueriesRepository() {
    String sub = "auth0|2ed285c5092483e8156c040b7aaff3e0";
    Long projectId = 1234L;
    String permission = "test-permission";

    TestSecurityContextHolder.setAuthentication(new TestingAuthenticationToken(new BasicUserPrincipal(sub), null));

    doReturn(Boolean.TRUE).when(permissionRepositoryMock).memberHasAllOfPermissionsInProject(sub, projectId, List.of(permission));

    Boolean result = fixture.hasProjectPermissions(projectId, permission);

    assertTrue(result);
  }

  @Test
  void hasProjectPermissionsReturnsFalseWithoutAuth0UserSub() {
    Boolean result = fixture.hasProjectPermissions(1234L, "test-permission");
    assertFalse(result);
  }
}
