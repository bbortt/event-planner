package io.github.bbortt.event.planner.apps.permissions.v1.rest;

import io.github.bbortt.event.planner.apps.permissions.service.MemberService;
import java.net.URI;
import javax.ws.rs.core.Response;

public class MemberApiImpl implements MemberApi {

  private final MemberService memberService;

  public MemberApiImpl(MemberService memberService) {
    this.memberService = memberService;
  }

  @Override
  public Response createAdminMemberInProject(String auth0UserId, Long projectId) {
    memberService.createAdminMemberInProject(auth0UserId, projectId);
    return Response.created(URI.create("api/rest/v1/permissions")).build();
  }
}
