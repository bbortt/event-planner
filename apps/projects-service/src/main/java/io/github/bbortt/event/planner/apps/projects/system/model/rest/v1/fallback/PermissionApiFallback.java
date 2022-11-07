package io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.fallback;

import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.PermissionApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.dto.ApiResponse;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PermissionApiFallback implements PermissionApi {

  private static final Logger logger = LoggerFactory.getLogger(PermissionApiFallback.class);

  private final Exception cause;

  public PermissionApiFallback(Exception cause) {
    this.cause = cause;
  }

  @Override
  public void grantPermissionInProject(String permission, String auth0UserId, Long projectId, String callingAuth0UserId) {}

  @Override
  public ApiResponse<Void> grantPermissionInProjectWithHttpInfo(
    String permission,
    String auth0UserId,
    Long projectId,
    String callingAuth0UserId
  ) {
    return null;
  }

  @Override
  public void grantPermissionInProject(String permission, Map<String, Object> queryParams) {}

  @Override
  public ApiResponse<Void> grantPermissionInProjectWithHttpInfo(String permission, Map<String, Object> queryParams) {
    return null;
  }

  @Override
  public List readPermissionsByUserAndProject(String auth0UserId, Long projectId) {
    return null;
  }

  @Override
  public ApiResponse<List> readPermissionsByUserAndProjectWithHttpInfo(String auth0UserId, Long projectId) {
    return null;
  }

  @Override
  public List readPermissionsByUserAndProject(Map<String, Object> queryParams) {
    return null;
  }

  @Override
  public ApiResponse<List> readPermissionsByUserAndProjectWithHttpInfo(Map<String, Object> queryParams) {
    return null;
  }

  @Override
  public void revokePermissionInProject(String permission, String auth0UserId, Long projectId, String callingAuth0UserId) {}

  @Override
  public ApiResponse<Void> revokePermissionInProjectWithHttpInfo(
    String permission,
    String auth0UserId,
    Long projectId,
    String callingAuth0UserId
  ) {
    return null;
  }

  @Override
  public void revokePermissionInProject(String permission, Map<String, Object> queryParams) {}

  @Override
  public ApiResponse<Void> revokePermissionInProjectWithHttpInfo(String permission, Map<String, Object> queryParams) {
    return null;
  }
}
