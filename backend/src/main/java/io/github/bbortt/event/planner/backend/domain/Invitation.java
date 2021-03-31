package io.github.bbortt.event.planner.backend.domain;

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
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

/**
 * A Invitation.
 */
@Entity
@Table(
    name = "invitation",
    uniqueConstraints = {
        @UniqueConstraint(name = "unique_invitation_per_project", columnNames = { "email", "project_id" }),
        @UniqueConstraint(name = "unique_user_per_project", columnNames = { "jhi_user_id", "project_id" }),
    }
)
public class Invitation extends AbstractAuditingEntity implements Serializable {

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
    @Column(name = "email", length = 254, nullable = false, updatable = false)
    private String email;

    @NotNull
    @Column(name = "accepted", nullable = false)
    private Boolean accepted;

    @Size(min = 36, max = 36)
    @Column(name = "token", columnDefinition = "bpchar(36)")
    private String token;

    @Size(min = 4, max = 23)
    @Column(name = "color", length = 23)
    private String color;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "project_id", updatable = false)
    @JsonIgnoreProperties(value = "invitations", allowSetters = true)
    private Project project;

    @Size(max = 100)
    @Column(name = "jhi_user_id")
    private String jhiUserId;

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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Invitation token(String token) {
        this.token = token;
        return this;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Invitation color(String color) {
        this.color = color;
        return this;
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

    public String getJhiUserId() {
        return jhiUserId;
    }

    public void setJhiUserId(String jhiUserId) {
        this.jhiUserId = jhiUserId;
    }

    public Invitation jhiUserId(String jhiUserId) {
        this.jhiUserId = jhiUserId;
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
            ", color='" + getColor() + "'" +
            ", jhiUserId='" + getJhiUserId() + "'" +
            "}";
    }
}
