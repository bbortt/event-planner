package io.github.bbortt.event.planner.apps.projects.v1.dto;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.github.bbortt.event.planner.apps.projects.v1.dto.ProjectDto;
import java.math.BigDecimal;
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
 * ReadProjects200ResponseDto
 */

@JsonTypeName("readProjects_200_response")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2022-10-08T16:49:31.140405563+02:00[Europe/Zurich]")
public class ReadProjects200ResponseDto {

  @JsonProperty("contents")
  @Valid
  private List<ProjectDto> contents = null;

  @JsonProperty("totalElements")
  private BigDecimal totalElements;

  @JsonProperty("totalPages")
  private BigDecimal totalPages;

  @JsonProperty("number")
  private BigDecimal number;

  public ReadProjects200ResponseDto contents(List<ProjectDto> contents) {
    this.contents = contents;
    return this;
  }

  public ReadProjects200ResponseDto addContentsItem(ProjectDto contentsItem) {
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

  public ReadProjects200ResponseDto totalElements(BigDecimal totalElements) {
    this.totalElements = totalElements;
    return this;
  }

  /**
   * Get totalElements
   * @return totalElements
  */
  @Valid 
  @Schema(name = "totalElements", required = false)
  public BigDecimal getTotalElements() {
    return totalElements;
  }

  public void setTotalElements(BigDecimal totalElements) {
    this.totalElements = totalElements;
  }

  public ReadProjects200ResponseDto totalPages(BigDecimal totalPages) {
    this.totalPages = totalPages;
    return this;
  }

  /**
   * Get totalPages
   * @return totalPages
  */
  @Valid 
  @Schema(name = "totalPages", required = false)
  public BigDecimal getTotalPages() {
    return totalPages;
  }

  public void setTotalPages(BigDecimal totalPages) {
    this.totalPages = totalPages;
  }

  public ReadProjects200ResponseDto number(BigDecimal number) {
    this.number = number;
    return this;
  }

  /**
   * Get number
   * @return number
  */
  @Valid 
  @Schema(name = "number", required = false)
  public BigDecimal getNumber() {
    return number;
  }

  public void setNumber(BigDecimal number) {
    this.number = number;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ReadProjects200ResponseDto readProjects200Response = (ReadProjects200ResponseDto) o;
    return Objects.equals(this.contents, readProjects200Response.contents) &&
        Objects.equals(this.totalElements, readProjects200Response.totalElements) &&
        Objects.equals(this.totalPages, readProjects200Response.totalPages) &&
        Objects.equals(this.number, readProjects200Response.number);
  }

  @Override
  public int hashCode() {
    return Objects.hash(contents, totalElements, totalPages, number);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ReadProjects200ResponseDto {\n");
    sb.append("    contents: ").append(toIndentedString(contents)).append("\n");
    sb.append("    totalElements: ").append(toIndentedString(totalElements)).append("\n");
    sb.append("    totalPages: ").append(toIndentedString(totalPages)).append("\n");
    sb.append("    number: ").append(toIndentedString(number)).append("\n");
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

