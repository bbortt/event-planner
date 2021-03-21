package io.github.bbortt.event.planner.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

/**
 * A Location.
 */
@Entity
@Table(
    name = "location",
    uniqueConstraints = { @UniqueConstraint(name = "unique_location_per_project", columnNames = { "name", "project_id" }) }
)
public class Location implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(
        name = "location_id_seq",
        strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
        parameters = { @Parameter(name = "sequence_name", value = "location_id_seq"), @Parameter(name = "increment_size", value = "1") }
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "location_id_seq")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @ManyToOne(optional = false)
    @JsonIgnoreProperties(value = "locations", allowSetters = true)
    private Project project;

    @ManyToOne
    @JsonIgnoreProperties(value = "locations", allowSetters = true)
    private Responsibility responsibility;

    @OneToMany(mappedBy = "location")
    private Set<Section> sections = new HashSet<>();

    @OneToMany(mappedBy = "location")
    private Set<LocationTimeSlot> locationTimeSlots = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "jhi_user_id")
    @JsonIgnoreProperties(value = "location", allowSetters = true)
    private User user;

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

    public Location name(String name) {
        this.name = name;
        return this;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Location project(Project project) {
        this.project = project;
        return this;
    }

    public Responsibility getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
    }

    public Location responsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
        return this;
    }

    public Set<Section> getSections() {
        return sections;
    }

    public void setSections(Set<Section> sections) {
        this.sections = sections;
    }

    public Location sections(Set<Section> sections) {
        this.sections = sections;
        return this;
    }

    public Location addSection(Section section) {
        this.sections.add(section);
        section.setLocation(this);
        return this;
    }

    public Location removeSection(Section section) {
        this.sections.remove(section);
        section.setLocation(null);
        return this;
    }

    public Set<LocationTimeSlot> getLocationTimeSlots() {
        return locationTimeSlots;
    }

    public void setLocationTimeSlots(Set<LocationTimeSlot> locationTimeSlots) {
        this.locationTimeSlots = locationTimeSlots;
    }

    public Location addLocationTimeSlot(LocationTimeSlot locationTimeSlot) {
        this.locationTimeSlots.add(locationTimeSlot);
        locationTimeSlot.setLocation(this);
        return this;
    }

    public Location removeLocationTimeSlot(LocationTimeSlot locationTimeSlot) {
        this.locationTimeSlots.remove(locationTimeSlot);
        locationTimeSlot.setLocation(null);
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Location user(User user) {
        this.user = user;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Location)) {
            return false;
        }
        return id != null && id.equals(((Location) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Location{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
