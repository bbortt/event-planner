package io.github.bbortt.event.planner.apps.permissions.v1.dto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.github.bbortt.event.planner.apps.permissions.v1.dto.ProjectPermissionsDto;
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



@JsonTypeName("readPermissions_200_response_allOf")
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaJAXRSSpecServerCodegen", date = "2022-10-21T08:01:16.605386647+02:00[Europe/Zurich]")
public class ReadPermissions200ResponseAllOfDto  implements Serializable {
  private @Valid List<ProjectPermissionsDto> contents = null;

  /**
   **/
  public ReadPermissions200ResponseAllOfDto contents(List<ProjectPermissionsDto> contents) {
    this.contents = contents;
    return this;
  }

  
  @JsonProperty("contents")
  public List<ProjectPermissionsDto> getContents() {
    return contents;
  }

  @JsonProperty("contents")
  public void setContents(List<ProjectPermissionsDto> contents) {
    this.contents = contents;
  }

  public ReadPermissions200ResponseAllOfDto addContentsItem(ProjectPermissionsDto contentsItem) {
    if (this.contents == null) {
      this.contents = new ArrayList<>();
    }

    this.contents.add(contentsItem);
    return this;
  }

  public ReadPermissions200ResponseAllOfDto removeContentsItem(ProjectPermissionsDto contentsItem) {
    if (contentsItem != null && this.contents != null) {
      this.contents.remove(contentsItem);
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
    ReadPermissions200ResponseAllOfDto readPermissions200ResponseAllOf = (ReadPermissions200ResponseAllOfDto) o;
    return Objects.equals(this.contents, readPermissions200ResponseAllOf.contents);
  }

  @Override
  public int hashCode() {
    return Objects.hash(contents);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ReadPermissions200ResponseAllOfDto {\n");
    
    sb.append("    contents: ").append(toIndentedString(contents)).append("\n");
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

