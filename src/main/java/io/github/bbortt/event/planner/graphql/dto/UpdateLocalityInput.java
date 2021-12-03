package io.github.bbortt.event.planner.graphql.dto;

import javax.persistence.Column;
import javax.validation.constraints.Size;

public class UpdateLocalityInput {

  @Size(min = 1, max = 50)
  private String name;

  @Size(min = 1, max = 300)
  private String description;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
