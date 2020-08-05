package io.github.bbortt.event.planner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

/**
 * A Responsibility.
 */
@Entity
@Table(
    name = "responsibility",
    uniqueConstraints = { @UniqueConstraint(name = "unique_responsibility_per_project", columnNames = { "name", "project_id" }) }
)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Responsibility implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(
        name = "responsibility_id_seq",
        strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
        parameters = {
            @Parameter(name = "sequence_name", value = "responsibility_id_seq"), @Parameter(name = "increment_size", value = "1"),
        }
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "responsibility_id_seq")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "responsibilities", allowSetters = true)
    private Project project;

    @OneToMany(mappedBy = "responsibility")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Invitation> invitations = new HashSet<>();

    @OneToMany(mappedBy = "responsibility")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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

    public Responsibility name(String name) {
        this.name = name;
        return this;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Responsibility project(Project project) {
        this.project = project;
        return this;
    }

    public Set<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(Set<Invitation> invitations) {
        this.invitations = invitations;
    }

    public Responsibility invitations(Set<Invitation> invitations) {
        this.invitations = invitations;
        return this;
    }

    public Responsibility addInvitation(Invitation invitation) {
        this.invitations.add(invitation);
        invitation.setResponsibility(this);
        return this;
    }

    public Responsibility removeInvitation(Invitation invitation) {
        this.invitations.remove(invitation);
        invitation.setResponsibility(null);
        return this;
    }

    public Set<Location> getLocations() {
        return locations;
    }

    public void setLocations(Set<Location> locations) {
        this.locations = locations;
    }

    public Responsibility locations(Set<Location> locations) {
        this.locations = locations;
        return this;
    }

    public Responsibility addLocation(Location location) {
        this.locations.add(location);
        location.setResponsibility(this);
        return this;
    }

    public Responsibility removeLocation(Location location) {
        this.locations.remove(location);
        location.setResponsibility(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Responsibility)) {
            return false;
        }
        return id != null && id.equals(((Responsibility) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Responsibility{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
