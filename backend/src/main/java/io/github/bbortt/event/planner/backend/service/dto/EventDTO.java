package io.github.bbortt.event.planner.backend.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import java.time.ZonedDateTime;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class EventDTO {

    @Id
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    private String name;

    @Size(max = 300)
    private String description;

    @NotNull
    private ZonedDateTime startTime;

    @NotNull
    private ZonedDateTime endTime;

    @JsonIgnoreProperties(value = "events", allowSetters = true)
    private SectionDTO section;

    @JsonIgnoreProperties(value = "events", allowSetters = true)
    private Responsibility responsibility;

    private UserDTO user;

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

    public ZonedDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public SectionDTO getSection() {
        return section;
    }

    public void setSection(SectionDTO section) {
        this.section = section;
    }

    public Responsibility getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}
