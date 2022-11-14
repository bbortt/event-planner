package io.github.bbortt.event.planner.apps.permissions.service;

import io.github.bbortt.event.planner.apps.permissions.domain.Member;
import io.github.bbortt.event.planner.apps.permissions.domain.MemberPermission;
import io.github.bbortt.event.planner.apps.permissions.domain.Permission;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.panache.common.Parameters;
import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@ApplicationScoped
public class PermissionService {

  @Transactional
  public List<String> findAllByAuth0UserIdAndProjectId(String auth0UserId, Long projectId) {
    return Permission.findAllByAuth0UserIdAndProjectId(auth0UserId, projectId);
  }

  @Transactional
  public boolean hasAnyPermissionInProject(List<String> permissions, Long projectId, String auth0UserId) {
    return findAllByAuth0UserIdAndProjectId(auth0UserId, projectId).stream().anyMatch(permissions::contains);
  }

  @Transactional
  public void grantPermissionInProject(String permissionId, String auth0UserId, long projectId) {
    Permission permission = (Permission) PanacheEntityBase
      .findByIdOptional(permissionId)
      .orElseThrow(() -> new IllegalArgumentException(String.format("Invalid Permission '%s'!", permissionId)));
    Member member = (Member) PanacheEntityBase
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
