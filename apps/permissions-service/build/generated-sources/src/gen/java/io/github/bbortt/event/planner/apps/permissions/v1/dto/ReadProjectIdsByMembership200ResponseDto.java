package io.github.bbortt.event.planner.apps.permissions.v1.dto;

import com.fasterxml.jackson.annotation.JsonTypeName;
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



@JsonTypeName("readProjectIdsByMembership_200_response")
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaJAXRSSpecServerCodegen", date = "2022-11-20T18:09:21.446513355+01:00[Europe/Zurich]")
public class ReadProjectIdsByMembership200ResponseDto  implements Serializable {
  private @Valid List<Long> contents = null;

  /**
   **/
  public ReadProjectIdsByMembership200ResponseDto contents(List<Long> contents) {
    this.contents = contents;
    return this;
  }

  
  @JsonProperty("contents")
  public List<Long> getContents() {
    return contents;
  }

  @JsonProperty("contents")
  public void setContents(List<Long> contents) {
    this.contents = contents;
  }

  public ReadProjectIdsByMembership200ResponseDto addContentsItem(Long contentsItem) {
    if (this.contents == null) {
      this.contents = new ArrayList<>();
    }

    this.contents.add(contentsItem);
    return this;
  }

  public ReadProjectIdsByMembership200ResponseDto removeContentsItem(Long contentsItem) {
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
    ReadProjectIdsByMembership200ResponseDto readProjectIdsByMembership200Response = (ReadProjectIdsByMembership200ResponseDto) o;
    return Objects.equals(this.contents, readProjectIdsByMembership200Response.contents);
  }

  @Override
  public int hashCode() {
    return Objects.hash(contents);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ReadProjectIdsByMembership200ResponseDto {\n");
    
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

