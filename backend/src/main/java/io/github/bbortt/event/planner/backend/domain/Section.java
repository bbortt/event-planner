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
 * A Section.
 */
@Entity
@Table(
    name = "section",
    uniqueConstraints = { @UniqueConstraint(name = "unique_section_per_location", columnNames = { "name", "location_id" }) }
)
public class Section implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(
        name = "section_id_seq",
        strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
        parameters = { @Parameter(name = "sequence_name", value = "section_id_seq"), @Parameter(name = "increment_size", value = "1") }
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "section_id_seq")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @ManyToOne(optional = false)
    @JsonIgnoreProperties(value = "sections", allowSetters = true)
    private Location location;

    @OneToMany(mappedBy = "section")
    @JsonIgnoreProperties(value = "section", allowSetters = true)
    private Set<Event> events = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "sections", allowSetters = true)
    private Responsibility responsibility;

    @ManyToOne
    @JoinColumn(name = "jhi_user_id")
    @JsonIgnoreProperties(value = "sections", allowSetters = true)
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

    public Section name(String name) {
        this.name = name;
        return this;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Section location(Location location) {
        this.location = location;
        return this;
    }

    public Set<Event> getEvents() {
        return events;
    }

    public void setEvents(Set<Event> events) {
        this.events = events;
    }

    public Section events(Set<Event> events) {
        this.events = events;
        return this;
    }

    public Section addEvent(Event event) {
        this.events.add(event);
        event.setSection(this);
        return this;
    }

    public Section removeEvent(Event event) {
        this.events.remove(event);
        event.setSection(this);
        return this;
    }

    public Responsibility getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
    }

    public Section responsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Section user(User user) {
        this.user = user;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Section)) {
            return false;
        }
        return id != null && id.equals(((Section) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Section{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
