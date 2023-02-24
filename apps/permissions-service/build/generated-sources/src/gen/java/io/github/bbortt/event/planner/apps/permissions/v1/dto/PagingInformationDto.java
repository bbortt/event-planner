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



@JsonTypeName("PagingInformation")
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaJAXRSSpecServerCodegen", date = "2022-10-21T08:01:16.605386647+02:00[Europe/Zurich]")
public class PagingInformationDto  implements Serializable {
  private @Valid List<Object> contents = null;
  private @Valid BigDecimal totalElements;
  private @Valid BigDecimal totalPages;
  private @Valid BigDecimal number;

  /**
   **/
  public PagingInformationDto contents(List<Object> contents) {
    this.contents = contents;
    return this;
  }

  
  @JsonProperty("contents")
  public List<Object> getContents() {
    return contents;
  }

  @JsonProperty("contents")
  public void setContents(List<Object> contents) {
    this.contents = contents;
  }

  public PagingInformationDto addContentsItem(Object contentsItem) {
    if (this.contents == null) {
      this.contents = new ArrayList<>();
    }

    this.contents.add(contentsItem);
    return this;
  }

  public PagingInformationDto removeContentsItem(Object contentsItem) {
    if (contentsItem != null && this.contents != null) {
      this.contents.remove(contentsItem);
    }

    return this;
  }
  /**
   **/
  public PagingInformationDto totalElements(BigDecimal totalElements) {
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
  public PagingInformationDto totalPages(BigDecimal totalPages) {
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
  public PagingInformationDto number(BigDecimal number) {
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
    PagingInformationDto pagingInformation = (PagingInformationDto) o;
    return Objects.equals(this.contents, pagingInformation.contents) &&
        Objects.equals(this.totalElements, pagingInformation.totalElements) &&
        Objects.equals(this.totalPages, pagingInformation.totalPages) &&
        Objects.equals(this.number, pagingInformation.number);
  }

  @Override
  public int hashCode() {
    return Objects.hash(contents, totalElements, totalPages, number);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PagingInformationDto {\n");
    
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

