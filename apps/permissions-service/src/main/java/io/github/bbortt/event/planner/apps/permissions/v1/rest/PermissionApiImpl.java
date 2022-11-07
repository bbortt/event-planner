package io.github.bbortt.event.planner.apps.permissions.v1.rest;

import io.github.bbortt.event.planner.apps.permissions.service.PermissionService;
import java.net.URI;
import javax.ws.rs.core.Response;

public class PermissionApiImpl implements PermissionApi {

  private final PermissionService permissionService;

  public PermissionApiImpl(PermissionService permissionService) {
    this.permissionService = permissionService;
  }

  @Override
  public Response grantPermissionInProject(String permission, String auth0UserId, Long projectId, String callingAuth0UserId) {
    permissionService.grantPermissionInProject(permission, auth0UserId, projectId);
    return Response.created(URI.create("api/rest/v1/permissions")).build();
  }

  @Override
  public Response readPermissionsByUserAndProject(String auth0UserId, Long projectId) {
    return Response.ok(permissionService.findAllByAuth0UserIdAndProjectId(auth0UserId, projectId)).build();
  }

  @Override
  public Response revokePermissionInProject(String permission, String auth0UserId, Long projectId, String callingAuth0UserId) {
    permissionService.revokePermissionInProject(permission, auth0UserId, projectId);
    return Response.noContent().build();
  }
}
