package io.github.bbortt.event.planner.backend.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class SectionDTO {

    @Id
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    private String name;

    @NotNull
    @JsonIgnoreProperties(value = "sections", allowSetters = true)
    private LocationDTO location;

    @JsonIgnoreProperties(value = "section", allowSetters = true)
    private Set<EventDTO> events = new HashSet<>();

    @JsonIgnoreProperties(value = "sections", allowSetters = true)
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

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    public Set<EventDTO> getEvents() {
        return events;
    }

    public void setEvents(Set<EventDTO> events) {
        this.events = events;
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
