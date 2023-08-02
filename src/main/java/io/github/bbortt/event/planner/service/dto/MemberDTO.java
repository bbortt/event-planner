package io.github.bbortt.event.planner.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link io.github.bbortt.event.planner.domain.Member} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MemberDTO implements Serializable {

    private Long id;

    @Email
    @NotNull
    @Size(min = 1, max = 191)
    private String invitedEmail;

    private String createdBy;

    private Instant createdDate;

    @NotNull
    private Boolean accepted;

    private String acceptedBy;

    private Instant acceptedDate;

    private AdminUserDTO user;

    private ProjectDTO project;

    public Long getId() {
        return id;
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Boolean getAccepted() {
        return accepted;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }

    public String getAcceptedBy() {
        return acceptedBy;
    }

    public void setAcceptedBy(String acceptedBy) {
        this.acceptedBy = acceptedBy;
    }

    public Instant getAcceptedDate() {
        return acceptedDate;
    }

    public void setAcceptedDate(Instant acceptedDate) {
        this.acceptedDate = acceptedDate;
    }

    @JsonIgnore
    public AdminUserDTO getUser() {
        return user;
    }

    public void setUser(AdminUserDTO user) {
        this.user = user;
    }

    public ProjectDTO getProject() {
        return project;
    }

    public void setProject(ProjectDTO project) {
        this.project = project;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MemberDTO)) {
            return false;
        }

        MemberDTO memberDTO = (MemberDTO) o;
        if (this.id == null) {
            return false;
        }

        return Objects.equals(this.id, memberDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MemberDTO{" +
            "id=" + getId() +
            ", invitedEmail='" + getInvitedEmail() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", accepted='" + getAccepted() + "'" +
            ", acceptedBy='" + getAcceptedBy() + "'" +
            ", acceptedDate='" + getAcceptedDate() + "'" +
            ", user='" + getUser() + "'" +
            ", project=" + getProject() +
            "}";
    }
}
