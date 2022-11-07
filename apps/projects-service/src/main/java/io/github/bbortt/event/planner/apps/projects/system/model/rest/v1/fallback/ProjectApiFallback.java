package io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.fallback;

import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.ProjectApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.dto.ApiResponse;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.dto.ReadProjectIdsByMembership200ResponseDto;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProjectApiFallback implements ProjectApi {

  private static final Logger logger = LoggerFactory.getLogger(PermissionApiFallback.class);

  private final Exception cause;

  public ProjectApiFallback(Exception cause) {
    this.cause = cause;
  }

  @Override
  public void hasAnyPermissionInProject(List<String> permissions, Long projectId, String auth0UserId) {}

  @Override
  public ApiResponse<Void> hasAnyPermissionInProjectWithHttpInfo(List<String> permissions, Long projectId, String auth0UserId) {
    return null;
  }

  @Override
  public void hasAnyPermissionInProject(Long projectId, Map<String, Object> queryParams) {}

  @Override
  public ApiResponse<Void> hasAnyPermissionInProjectWithHttpInfo(Long projectId, Map<String, Object> queryParams) {
    return null;
  }

  @Override
  public ReadProjectIdsByMembership200ResponseDto readProjectIdsByMembership(String auth0UserId) {
    return null;
  }

  @Override
  public ApiResponse<ReadProjectIdsByMembership200ResponseDto> readProjectIdsByMembershipWithHttpInfo(String auth0UserId) {
    return null;
  }

  @Override
  public ReadProjectIdsByMembership200ResponseDto readProjectIdsByMembership(Map<String, Object> queryParams) {
    return null;
  }

  @Override
  public ApiResponse<ReadProjectIdsByMembership200ResponseDto> readProjectIdsByMembershipWithHttpInfo(Map<String, Object> queryParams) {
    return null;
  }
}
