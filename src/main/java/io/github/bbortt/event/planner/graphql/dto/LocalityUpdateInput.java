package io.github.bbortt.event.planner.graphql.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class LocalityUpdateInput {

  @NotNull
  private Long id;

  @Size(min = 1, max = 50)
  private String name;

  @Size(min = 1, max = 300)
  private String description;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

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
