package io.github.bbortt.event.planner.apps.permissions.v1.dto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import javax.validation.constraints.*;
import javax.validation.Valid;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonTypeName;



@JsonTypeName("ProjectPermissions")
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaJAXRSSpecServerCodegen", date = "2022-10-21T08:01:16.605386647+02:00[Europe/Zurich]")
public class ProjectPermissionsDto  implements Serializable {
  private @Valid BigDecimal projectId;
  private @Valid List<String> permissions = new ArrayList<>();

  /**
   **/
  public ProjectPermissionsDto projectId(BigDecimal projectId) {
    this.projectId = projectId;
    return this;
  }

  
  @JsonProperty("projectId")
  @NotNull
  public BigDecimal getProjectId() {
    return projectId;
  }

  @JsonProperty("projectId")
  public void setProjectId(BigDecimal projectId) {
    this.projectId = projectId;
  }

  /**
   **/
  public ProjectPermissionsDto permissions(List<String> permissions) {
    this.permissions = permissions;
    return this;
  }

  
  @JsonProperty("permissions")
  @NotNull
  public List< @Size(max=20)String> getPermissions() {
    return permissions;
  }

  @JsonProperty("permissions")
  public void setPermissions(List<String> permissions) {
    this.permissions = permissions;
  }

  public ProjectPermissionsDto addPermissionsItem(String permissionsItem) {
    if (this.permissions == null) {
      this.permissions = new ArrayList<>();
    }

    this.permissions.add(permissionsItem);
    return this;
  }

  public ProjectPermissionsDto removePermissionsItem(String permissionsItem) {
    if (permissionsItem != null && this.permissions != null) {
      this.permissions.remove(permissionsItem);
    }

    return this;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ProjectPermissionsDto projectPermissions = (ProjectPermissionsDto) o;
    return Objects.equals(this.projectId, projectPermissions.projectId) &&
        Objects.equals(this.permissions, projectPermissions.permissions);
  }

  @Override
  public int hashCode() {
    return Objects.hash(projectId, permissions);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ProjectPermissionsDto {\n");
    
    sb.append("    projectId: ").append(toIndentedString(projectId)).append("\n");
    sb.append("    permissions: ").append(toIndentedString(permissions)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }


}

