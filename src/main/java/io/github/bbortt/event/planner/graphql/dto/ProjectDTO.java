package io.github.bbortt.event.planner.graphql.dto;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ProjectDTO {

  @NotNull
  private Long id;

  @NotNull
  @Size(min = 36, max = 36)
  private UUID token;

  @NotNull
  @Size(min = 1, max = 50)
  private String name;

  @Size(min = 1, max = 300)
  private String description;

  @NotNull
  private OffsetDateTime startTime;

  @NotNull
  private OffsetDateTime endTime;

  @NotNull
  private Boolean archived;

  @NotNull
  private Set<MemberDTO> members = new HashSet<>();

  @NotNull
  private Set<LocalityDTO> localities = new HashSet<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UUID getToken() {
    return token;
  }

  public void setToken(UUID token) {
    this.token = token;
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

  public OffsetDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(OffsetDateTime startTime) {
    this.startTime = startTime;
  }

  public OffsetDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(OffsetDateTime endTime) {
    this.endTime = endTime;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Set<MemberDTO> getMembers() {
    return members;
  }

  public void setMembers(Set<MemberDTO> members) {
    this.members = members;
  }

  public Set<LocalityDTO> getLocalities() {
    return localities;
  }

  public void setLocalities(Set<LocalityDTO> localities) {
    this.localities = localities;
  }
}
