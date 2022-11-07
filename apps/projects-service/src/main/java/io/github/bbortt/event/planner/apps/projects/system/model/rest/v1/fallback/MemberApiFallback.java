package io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.fallback;

import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.MemberApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.dto.ApiResponse;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MemberApiFallback implements MemberApi {

  private static final Logger logger = LoggerFactory.getLogger(MemberApiFallback.class);

  private final Exception cause;

  public MemberApiFallback(Exception cause) {
    this.cause = cause;
  }

  @Override
  public void createAdminMemberInProject(String auth0UserId, Long projectId) {}

  @Override
  public ApiResponse<Void> createAdminMemberInProjectWithHttpInfo(String auth0UserId, Long projectId) {
    return null;
  }

  @Override
  public void createAdminMemberInProject(Map<String, Object> queryParams) {}

  @Override
  public ApiResponse<Void> createAdminMemberInProjectWithHttpInfo(Map<String, Object> queryParams) {
    return null;
  }
}
