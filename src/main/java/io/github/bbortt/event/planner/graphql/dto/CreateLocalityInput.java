package io.github.bbortt.event.planner.graphql.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CreateLocalityInput {

  @NotNull
  @Size(min = 1, max = 50)
  private String name;

  @Size(min = 1, max = 300)
  private String description;

  private Long parentLocalityId;

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

  public Long getParentLocalityId() {
    return parentLocalityId;
  }

  public void setParentLocalityId(Long parentLocalityId) {
    this.parentLocalityId = parentLocalityId;
  }
}
