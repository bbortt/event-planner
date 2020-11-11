package io.github.bbortt.event.planner.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

/**
 * A Project.
 */
@Entity
@Table(name = "project")
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(
        name = "project_id_seq",
        strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
        parameters = { @Parameter(name = "sequence_name", value = "project_id_seq"), @Parameter(name = "increment_size", value = "1") }
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_id_seq")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Size(min = 1, max = 300)
    @Column(name = "description", length = 300)
    private String description;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private ZonedDateTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private ZonedDateTime endTime;

    @OneToMany(mappedBy = "project")
    private Set<Responsibility> responsibilities = new HashSet<>();

    @OneToMany(mappedBy = "project")
    private Set<Invitation> invitations = new HashSet<>();

    @OneToMany(mappedBy = "project")
    private Set<Location> locations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
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

    public Project name(String name) {
        this.name = name;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Project description(String description) {
        this.description = description;
        return this;
    }

    public ZonedDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public Project startTime(ZonedDateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public ZonedDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public Project endTime(ZonedDateTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public Set<Responsibility> getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(Set<Responsibility> responsibilities) {
        this.responsibilities = responsibilities;
    }

    public Project responsibilities(Set<Responsibility> responsibilities) {
        this.responsibilities = responsibilities;
        return this;
    }

    public Project addResponsibility(Responsibility responsibility) {
        this.responsibilities.add(responsibility);
        responsibility.setProject(this);
        return this;
    }

    public Project removeResponsibility(Responsibility responsibility) {
        this.responsibilities.remove(responsibility);
        responsibility.setProject(null);
        return this;
    }

    public Set<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(Set<Invitation> invitations) {
        this.invitations = invitations;
    }

    public Project invitations(Set<Invitation> invitations) {
        this.invitations = invitations;
        return this;
    }

    public Project addInvitation(Invitation invitation) {
        this.invitations.add(invitation);
        invitation.setProject(this);
        return this;
    }

    public Project removeInvitation(Invitation invitation) {
        this.invitations.remove(invitation);
        invitation.setProject(null);
        return this;
    }

    public Set<Location> getLocations() {
        return locations;
    }

    public void setLocations(Set<Location> locations) {
        this.locations = locations;
    }

    public Project locations(Set<Location> locations) {
        this.locations = locations;
        return this;
    }

    public Project addLocation(Location location) {
        this.locations.add(location);
        location.setProject(this);
        return this;
    }

    public Project removeLocation(Location location) {
        this.locations.remove(location);
        location.setProject(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Project)) {
            return false;
        }
        return id != null && id.equals(((Project) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Project{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
