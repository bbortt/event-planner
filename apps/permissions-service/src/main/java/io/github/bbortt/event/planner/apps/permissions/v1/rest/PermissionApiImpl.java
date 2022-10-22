package io.github.bbortt.event.planner.apps.permissions.v1.rest;

import io.github.bbortt.event.planner.apps.permissions.service.MemberService;
import io.github.bbortt.event.planner.apps.permissions.service.PermissionService;
import io.github.bbortt.event.planner.apps.permissions.v1.dto.ReadPermissionsByUser200ResponseDto;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.stream.Collectors;
import javax.ws.rs.core.Response;

public class PermissionApiImpl implements PermissionApi {

  private final MemberService memberService;
  private final PermissionService permissionService;

  public PermissionApiImpl(MemberService memberService, PermissionService permissionService) {
    this.memberService = memberService;
    this.permissionService = permissionService;
  }

  @Override
  public Response assignPermissionInProject(String permission, String auth0UserId, BigDecimal projectId) {
    permissionService.assignPermissionInProject(permission, auth0UserId, projectId.longValueExact());
    try {
      return Response.created(new URI(String.format("/v1/permissions/%s/%s", auth0UserId, projectId))).build();
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException(e);
    }
  }

  @Override
  public Response readPermissionsByUser(String auth0UserId) {
    return Response
      .ok(
        new ReadPermissionsByUser200ResponseDto()
          .contents(memberService.allProjectIdsByAuth0UserId(auth0UserId).stream().map(BigDecimal::valueOf).collect(Collectors.toList()))
      )
      .build();
  }

  @Override
  public Response readPermissionsByUserAndProject(String auth0UserId, BigDecimal projectId) {
    return Response.ok(permissionService.allByProjectIdAndAuth0UserId(auth0UserId, projectId.longValueExact())).build();
  }

  @Override
  public Response revokePermissionInProject(String permission, String auth0UserId, BigDecimal projectId) {
    permissionService.revokePermissionInProject(permission, auth0UserId, projectId.longValueExact());
    return Response.noContent().build();
  }
}
