package io.github.bbortt.event.planner.graphql.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ProjectUpdateInput {

  @NotNull
  private Long id;

  @Size(min = 1, max = 50)
  private String name;

  @Size(min = 1, max = 300)
  private String description;

  private Boolean archived;

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

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
}
