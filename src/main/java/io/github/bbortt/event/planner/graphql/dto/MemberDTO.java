package io.github.bbortt.event.planner.graphql.dto;

import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.NotNull;

public class MemberDTO {

  @NotNull
  private Long id;

  @NotNull
  private ProjectDTO project;

  @NotNull
  private Boolean accepted;

  @NotNull
  private Auth0UserDTO auth0User;

  @NotNull
  private Set<PermissonDTO> permissions = new HashSet<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public ProjectDTO getProject() {
    return project;
  }

  public void setProject(ProjectDTO project) {
    this.project = project;
  }

  public Boolean getAccepted() {
    return accepted;
  }

  public void setAccepted(Boolean accepted) {
    this.accepted = accepted;
  }

  public Auth0UserDTO getAuth0User() {
    return auth0User;
  }

  public void setAuth0User(Auth0UserDTO auth0User) {
    this.auth0User = auth0User;
  }

  public Set<PermissonDTO> getPermissions() {
    return permissions;
  }

  public void setPermissions(Set<PermissonDTO> permissions) {
    this.permissions = permissions;
  }
}
