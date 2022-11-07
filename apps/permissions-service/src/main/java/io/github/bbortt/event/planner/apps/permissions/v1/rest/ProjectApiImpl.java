package io.github.bbortt.event.planner.apps.permissions.v1.rest;

import io.github.bbortt.event.planner.apps.permissions.service.MemberService;
import io.github.bbortt.event.planner.apps.permissions.service.PermissionService;
import java.util.List;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

public class ProjectApiImpl implements ProjectApi {

  private final MemberService memberService;
  private final PermissionService permissionService;

  public ProjectApiImpl(MemberService memberService, PermissionService permissionService) {
    this.memberService = memberService;
    this.permissionService = permissionService;
  }

  @Override
  public Response hasAnyPermissionInProject(List<String> permissions, Long projectId, String auth0UserId) {
    if (permissionService.hasAnyPermissionInProject(permissions, projectId, auth0UserId)) {
      return Response.ok().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }

  @Override
  public Response readProjectIdsByMembership(String auth0UserId) {
    return Response.ok(memberService.allProjectIdsByAuth0UserId(auth0UserId)).build();
  }
}
