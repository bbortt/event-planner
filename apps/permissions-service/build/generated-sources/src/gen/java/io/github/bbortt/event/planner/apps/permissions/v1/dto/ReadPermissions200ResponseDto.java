package io.github.bbortt.event.planner.apps.permissions.v1.dto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.github.bbortt.event.planner.apps.permissions.v1.dto.ProjectPermissionsDto;
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



@JsonTypeName("readPermissions_200_response")
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaJAXRSSpecServerCodegen", date = "2022-10-21T08:01:16.605386647+02:00[Europe/Zurich]")
public class ReadPermissions200ResponseDto  implements Serializable {
  private @Valid List<ProjectPermissionsDto> contents = null;
  private @Valid BigDecimal totalElements;
  private @Valid BigDecimal totalPages;
  private @Valid BigDecimal number;

  /**
   **/
  public ReadPermissions200ResponseDto contents(List<ProjectPermissionsDto> contents) {
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

  public ReadPermissions200ResponseDto addContentsItem(ProjectPermissionsDto contentsItem) {
    if (this.contents == null) {
      this.contents = new ArrayList<>();
    }

    this.contents.add(contentsItem);
    return this;
  }

  public ReadPermissions200ResponseDto removeContentsItem(ProjectPermissionsDto contentsItem) {
    if (contentsItem != null && this.contents != null) {
      this.contents.remove(contentsItem);
    }

    return this;
  }
  /**
   **/
  public ReadPermissions200ResponseDto totalElements(BigDecimal totalElements) {
    this.totalElements = totalElements;
    return this;
  }

  
  @JsonProperty("totalElements")
  public BigDecimal getTotalElements() {
    return totalElements;
  }

  @JsonProperty("totalElements")
  public void setTotalElements(BigDecimal totalElements) {
    this.totalElements = totalElements;
  }

  /**
   **/
  public ReadPermissions200ResponseDto totalPages(BigDecimal totalPages) {
    this.totalPages = totalPages;
    return this;
  }

  
  @JsonProperty("totalPages")
  public BigDecimal getTotalPages() {
    return totalPages;
  }

  @JsonProperty("totalPages")
  public void setTotalPages(BigDecimal totalPages) {
    this.totalPages = totalPages;
  }

  /**
   **/
  public ReadPermissions200ResponseDto number(BigDecimal number) {
    this.number = number;
    return this;
  }

  
  @JsonProperty("number")
  public BigDecimal getNumber() {
    return number;
  }

  @JsonProperty("number")
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
    ReadPermissions200ResponseDto readPermissions200Response = (ReadPermissions200ResponseDto) o;
    return Objects.equals(this.contents, readPermissions200Response.contents) &&
        Objects.equals(this.totalElements, readPermissions200Response.totalElements) &&
        Objects.equals(this.totalPages, readPermissions200Response.totalPages) &&
        Objects.equals(this.number, readPermissions200Response.number);
  }

  @Override
  public int hashCode() {
    return Objects.hash(contents, totalElements, totalPages, number);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ReadPermissions200ResponseDto {\n");
    
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

