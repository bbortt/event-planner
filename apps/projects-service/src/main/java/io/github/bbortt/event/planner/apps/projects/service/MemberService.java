package io.github.bbortt.event.planner.apps.projects.service;

import io.github.bbortt.event.planner.apps.projects.domain.Project;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.MemberApi;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Lazy
@Service
public class MemberService {

  private final MemberApi memberApi;

  public MemberService(MemberApi memberApi) {
    this.memberApi = memberApi;
  }

  public void createAdminMember(String auth0UserId, Project project) {
    memberApi.createAdminMemberInProject(auth0UserId, project.getId());
  }
}
