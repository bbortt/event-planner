package io.github.bbortt.event.planner.graphql.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class PermissonDTO {

  @NotNull
  @Size(min = 1, max = 20)
  private String id;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
}
