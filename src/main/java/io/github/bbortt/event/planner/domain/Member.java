package io.github.bbortt.event.planner.domain;

import io.github.bbortt.event.planner.audit.EntityAuditEventListener;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * A Member.
 */
@Entity
@Table(
    name = "member",
    uniqueConstraints = { @UniqueConstraint(name = "ux_invitation_per_project", columnNames = { "invited_email", "project_id" }) }
)
@EntityListeners({ AuditingEntityListener.class, EntityAuditEventListener.class })
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Member implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(min = 1, max = 191)
    @Column(name = "invited_email", length = 191, nullable = false, updatable = false)
    private String invitedEmail;

    @NotNull
    @Column(name = "accepted", nullable = false)
    private Boolean accepted;

    @CreatedBy
    @Column(name = "accepted_by", nullable = false, updatable = false)
    private String acceptedBy;

    @CreatedDate
    @Column(name = "accepted_date", nullable = false, updatable = false)
    private Instant acceptedDate;

    @Transient
    @ManyToOne(optional = false)
    @JoinColumn(name = "accepted_by", referencedColumnName = "email", nullable = false, updatable = false)
    private User user;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "project_id", referencedColumnName = "id", nullable = false, updatable = false)
    private Project project;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Member id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvitedEmail() {
        return invitedEmail;
    }

    public void setInvitedEmail(String invitedEmail) {
        this.invitedEmail = invitedEmail;
    }

    public Member invitedEmail(String invitedEmail) {
        this.setInvitedEmail(invitedEmail);
        return this;
    }

    public Boolean getAccepted() {
        return this.accepted;
    }

    public Member accepted(Boolean accepted) {
        this.setAccepted(accepted);
        return this;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }

    public String getAcceptedBy() {
        return this.acceptedBy;
    }

    public Member acceptedBy(String acceptedBy) {
        this.setAcceptedBy(acceptedBy);
        return this;
    }

    public void setAcceptedBy(String acceptedBy) {
        this.acceptedBy = acceptedBy;
    }

    public Instant getAcceptedDate() {
        return this.acceptedDate;
    }

    public Member acceptedDate(Instant acceptedDate) {
        this.setAcceptedDate(acceptedDate);
        return this;
    }

    public void setAcceptedDate(Instant acceptedDate) {
        this.acceptedDate = acceptedDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Member user(User user) {
        setUser(user);
        return this;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Member project(Project project) {
        this.setProject(project);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Member)) {
            return false;
        }
        return id != null && id.equals(((Member) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Member{" +
            "id=" + getId() +
            ", invitedEmail='" + getInvitedEmail() + "'" +
            ", accepted='" + getAccepted() + "'" +
            ", acceptedBy='" + getAcceptedBy() + "'" +
            ", acceptedDate='" + getAcceptedDate() + "'" +
            ", user='" +getUser() + "'" +
            ", project='" +getProject() + "'" +
            "}";
    }
}
