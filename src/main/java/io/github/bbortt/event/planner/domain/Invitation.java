package io.github.bbortt.event.planner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

/**
 * A Invitation.
 */
@Entity
@Table(name = "invitation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Invitation implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(
        name = "invitation_id_seq",
        strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
        parameters = { @Parameter(name = "sequence_name", value = "invitation_id_seq"), @Parameter(name = "increment_size", value = "1") }
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "invitation_id_seq")
    private Long id;

    @Email
    @NotNull
    @Size(min = 5, max = 254)
    @Column(name = "email", length = 254, nullable = false)
    private String email;

    @NotNull
    @Column(name = "accepted", nullable = false)
    private Boolean accepted;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "invitations", allowSetters = true)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "jhi_user_id")
    @JsonIgnoreProperties(value = "invitations", allowSetters = true)
    private User user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "invitations", allowSetters = true)
    private Role role;

    @ManyToOne
    @JsonIgnoreProperties(value = "invitations", allowSetters = true)
    private Responsibility responsibility;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Invitation email(String email) {
        this.email = email;
        return this;
    }

    public Boolean isAccepted() {
        return accepted;
    }

    public Invitation accepted(Boolean accepted) {
        this.accepted = accepted;
        return this;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Invitation project(Project project) {
        this.project = project;
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Invitation user(User user) {
        this.user = user;
        return this;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Invitation role(Role role) {
        this.role = role;
        return this;
    }

    public Responsibility getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
    }

    public Invitation responsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Invitation)) {
            return false;
        }
        return id != null && id.equals(((Invitation) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Invitation{" +
            "id=" + getId() +
            ", email='" + getEmail() + "'" +
            ", accepted='" + isAccepted() + "'" +
            "}";
    }
}
