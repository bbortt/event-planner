package io.github.bbortt.event.planner.apps.projects.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.PermissionApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.ProjectApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.dto.ApiResponse;
import java.util.HashMap;
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
  private ProjectApi projectApiMock;

  private PermissionService fixture;

  @BeforeEach
  void beforeEachSetup() {
    TestSecurityContextHolder.clearContext();
    fixture = new PermissionService(projectApiMock);
  }

  @Test
  void hasProjectPermissionsQueriesApi() {
    String sub = "auth0|2ed285c5092483e8156c040b7aaff3e0";
    Long projectId = 1234L;
    String permission = "test-permission";

    TestSecurityContextHolder.setAuthentication(new TestingAuthenticationToken(new BasicUserPrincipal(sub), null));

    doReturn(new ApiResponse<>(200, new HashMap<>()))
      .when(projectApiMock)
      .hasAnyPermissionInProjectWithHttpInfo(List.of(permission), projectId, sub);

    assertTrue(fixture.hasProjectPermissions(projectId, permission));
  }

  @Test
  void hasProjectPermissionsFiltersReturnedPermissions() {
    String sub = "auth0|2f73e5c5092483e8156c040b7aaff3e0";
    Long projectId = 1234L;
    String permission = "test-permission";

    TestSecurityContextHolder.setAuthentication(new TestingAuthenticationToken(new BasicUserPrincipal(sub), null));

    doReturn(new ApiResponse<>(403, new HashMap<>()))
      .when(projectApiMock)
      .hasAnyPermissionInProjectWithHttpInfo(List.of(permission), projectId, sub);

    assertFalse(fixture.hasProjectPermissions(projectId, permission));
  }

  @Test
  void hasProjectPermissionsReturnsFalseWithoutAuth0UserSub() {
    Boolean result = fixture.hasProjectPermissions(1234L, "test-permission");
    assertFalse(result);
  }
}
