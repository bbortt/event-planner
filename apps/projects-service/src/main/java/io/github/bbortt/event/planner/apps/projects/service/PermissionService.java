package io.github.bbortt.event.planner.apps.projects.service;

import io.github.bbortt.event.planner.apps.projects.security.SecurityUtils;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.ProjectApi;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Lazy
@Service
public class PermissionService {

  private final ProjectApi projectApi;

  public PermissionService(ProjectApi projectApi) {
    this.projectApi = projectApi;
  }

  public Boolean hasProjectPermissions(Long projectId, String... permissions) {
    Optional<String> auth0UserSub = SecurityUtils.getAuth0UserSub();
    if (auth0UserSub.isEmpty()) {
      return Boolean.FALSE;
    }

    return (
      projectApi.hasAnyPermissionInProjectWithHttpInfo(List.of(permissions), projectId, auth0UserSub.get()).getStatusCode() ==
      HttpStatus.OK.value()
    );
  }

  public Boolean isMemberOfProject(Long projectId) {
    Optional<String> auth0UserSub = SecurityUtils.getAuth0UserSub();
    if (auth0UserSub.isEmpty()) {
      return Boolean.FALSE;
    }

    return Objects.requireNonNull(projectApi.readProjectIdsByMembership(auth0UserSub.get()).getContents()).contains(projectId);
  }
}
