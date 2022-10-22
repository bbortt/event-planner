package io.github.bbortt.event.planner.apps.permissions.service;

import io.github.bbortt.event.planner.apps.permissions.domain.Member;
import io.github.bbortt.event.planner.apps.permissions.domain.MemberPermission;
import io.github.bbortt.event.planner.apps.permissions.domain.Permission;
import io.quarkus.panache.common.Parameters;
import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@ApplicationScoped
public class PermissionService {

  @Transactional
  public List<String> allByProjectIdAndAuth0UserId(String auth0UserId, Long projectId) {
    return Permission.findAllByAuth0UserIdAndProjectId(auth0UserId, projectId);
  }

  @Transactional
  public void assignPermissionInProject(String permissionId, String auth0UserId, long projectId) {
    Permission permission = (Permission) Permission
      .findByIdOptional(permissionId)
      .orElseThrow(() -> new IllegalArgumentException(String.format("Invalid Permission '%s'!", permissionId)));
    Member member = (Member) Member
      .find(
        "projectId = :projectId and auth0UserId = :auth0UserId",
        Parameters.with("projectId", projectId).and("auth0UserId", auth0UserId).map()
      )
      .singleResultOptional()
      .orElseThrow(() -> new IllegalArgumentException(String.format("Invalid Member ID '%s'!", auth0UserId)));
    new MemberPermission(member, permission).persistAndFlush();
  }

  @Transactional
  public void revokePermissionInProject(String permission, String auth0UserId, long projectId) {
    if (MemberPermission.deleteByAuth0UserIdAndProjectId(permission, auth0UserId, projectId) != 1) {
      throw new IllegalArgumentException(
        String.format("Corrupted permission '%s' for user id '%s' in project %d detected!", permission, auth0UserId, projectId)
      );
    }
  }
}
