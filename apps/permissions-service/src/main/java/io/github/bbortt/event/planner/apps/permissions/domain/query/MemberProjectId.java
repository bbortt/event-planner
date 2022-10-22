package io.github.bbortt.event.planner.apps.permissions.domain.query;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class MemberProjectId {

  public final Long projectId;

  public MemberProjectId(Long projectId) {
    this.projectId = projectId;
  }
}
