package io.github.bbortt.event.planner.graphql.dto;

import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class LocalityDTO {

  @NotNull
  private Long id;

  @NotNull
  @Size(min = 1, max = 50)
  private String name;

  @Size(min = 1, max = 300)
  private String description;

  @NotNull
  private ProjectDTO project;

  @NotNull
  private LocalityDTO parent;

  @NotNull
  private Set<LocalityDTO> children = new HashSet<>();

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

  public ProjectDTO getProject() {
    return project;
  }

  public void setProject(ProjectDTO project) {
    this.project = project;
  }

  public LocalityDTO getParent() {
    return parent;
  }

  public void setParent(LocalityDTO parent) {
    this.parent = parent;
  }

  public Set<LocalityDTO> getChildren() {
    return children;
  }

  public void setChildren(Set<LocalityDTO> children) {
    this.children = children;
  }
}
