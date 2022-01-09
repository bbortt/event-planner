package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.repository.PermissionRepository;
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
  private PermissionRepository permissionRepositoryMock;

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
    String sub = "auth0|jasd089fjqwjklfjasd8fqwe";
    Long projectId = 1234L;
    String permission = "test-permission";

    TestSecurityContextHolder.setAuthentication(new TestingAuthenticationToken(new BasicUserPrincipal(sub), null));

    doReturn(Boolean.TRUE).when(permissionRepositoryMock).auth0UserHasProjectPermission(sub, projectId, List.of(permission));

    Boolean result = fixture.hasProjectPermissions(projectId, permission);

    assertTrue(result);
  }

  @Test
  void hasProjectPermissionsReturnsFalseWithoutAuth0UserSub() {
    Boolean result = fixture.hasProjectPermissions(1234L, "test-permission");
    assertFalse(result);
  }
}
