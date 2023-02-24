package io.github.bbortt.event.planner.apps.projects.v1.dto;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.github.bbortt.event.planner.apps.projects.v1.dto.ProjectDto;
import java.util.ArrayList;
import java.util.List;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import javax.validation.Valid;
import javax.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import javax.annotation.Generated;

/**
 * ReadProjects200ResponseAllOfDto
 */

@JsonTypeName("readProjects_200_response_allOf")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2022-10-08T16:49:31.140405563+02:00[Europe/Zurich]")
public class ReadProjects200ResponseAllOfDto {

  @JsonProperty("contents")
  @Valid
  private List<ProjectDto> contents = null;

  public ReadProjects200ResponseAllOfDto contents(List<ProjectDto> contents) {
    this.contents = contents;
    return this;
  }

  public ReadProjects200ResponseAllOfDto addContentsItem(ProjectDto contentsItem) {
    if (this.contents == null) {
      this.contents = new ArrayList<>();
    }
    this.contents.add(contentsItem);
    return this;
  }

  /**
   * Get contents
   * @return contents
  */
  @Valid 
  @Schema(name = "contents", required = false)
  public List<ProjectDto> getContents() {
    return contents;
  }

  public void setContents(List<ProjectDto> contents) {
    this.contents = contents;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ReadProjects200ResponseAllOfDto readProjects200ResponseAllOf = (ReadProjects200ResponseAllOfDto) o;
    return Objects.equals(this.contents, readProjects200ResponseAllOf.contents);
  }

  @Override
  public int hashCode() {
    return Objects.hash(contents);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ReadProjects200ResponseAllOfDto {\n");
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

