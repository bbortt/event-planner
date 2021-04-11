package io.github.bbortt.event.planner.backend.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.bbortt.event.planner.backend.domain.LocationTimeSlot;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class LocationDTO {

    @Id
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    private String name;

    @NotNull
    @JsonIgnoreProperties(value = "locations", allowSetters = true)
    private Project project;

    @JsonIgnoreProperties(value = "locations", allowSetters = true)
    private Responsibility responsibility;

    private Set<SectionDTO> sections = new HashSet<>();
    private Set<LocationTimeSlot> locationTimeSlots = new HashSet<>();
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Responsibility getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
    }

    public Set<SectionDTO> getSections() {
        return sections;
    }

    public void setSections(Set<SectionDTO> sections) {
        this.sections = sections;
    }

    public Set<LocationTimeSlot> getLocationTimeSlots() {
        return locationTimeSlots;
    }

    public void setLocationTimeSlots(Set<LocationTimeSlot> locationTimeSlots) {
        this.locationTimeSlots = locationTimeSlots;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}
