package io.github.bbortt.event.planner.graphql.dto;

import java.time.OffsetDateTime;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ProjectCreateInput {

  @NotNull
  @Size(min = 1, max = 50)
  private String name;

  @Size(min = 1, max = 300)
  private String description;

  @NotNull
  private OffsetDateTime startTime;

  @NotNull
  private OffsetDateTime endTime;

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
}
