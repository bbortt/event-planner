package io.github.bbortt.event.planner.apps.projects.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.bbortt.event.planner.common.postgresql.PostgreSQLConstants;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners({ AuditingEntityListener.class })
@Table(
  schema = "projects_service",
  uniqueConstraints = { @UniqueConstraint(name = "unique_user_per_project", columnNames = { "project_id", "auth0_user_id" }) }
)
public class Member {

  @Id
  @Column(nullable = false, updatable = false)
  @GenericGenerator(
    name = "member_id_seq",
    strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
    parameters = {
      @org.hibernate.annotations.Parameter(name = "sequence_name", value = "member_id_seq"),
      @org.hibernate.annotations.Parameter(name = "increment_size", value = "1"),
    }
  )
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_id_seq")
  private Long id;

  @NotNull
  @ManyToOne(optional = false)
  @JoinColumn(name = "project_id", nullable = false, updatable = false)
  @JsonIgnoreProperties(value = "members", allowSetters = true)
  private Project project;

  @NotNull
  @CreatedBy
  @JsonIgnore
  @Column(length = 50, nullable = false, updatable = false)
  private String createdBy;

  @JsonIgnore
  @CreatedDate
  @Column(updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
  private Instant createdDate = Instant.now();

  @NotNull
  @Column(nullable = false)
  private Boolean accepted = Boolean.FALSE;

  @JsonIgnore
  @LastModifiedBy
  @Column(length = 50)
  private String acceptedBy;

  @JsonIgnore
  @LastModifiedDate
  @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")
  private Instant acceptedDate = Instant.now();

  @NotNull
  @Column(name = "auth0_user_id", length = 64, nullable = false, updatable = false)
  private String auth0UserId;

  @OneToMany(mappedBy = "member", cascade = { CascadeType.ALL })
  private Set<MemberPermission> permissions = new HashSet<>();

  public Member() {
    // Empty member
  }

  public Member(Project project, String auth0UserId) {
    this.project = project;
    this.auth0UserId = auth0UserId;
  }

  public Long getId() {
    return id;
  }

  public Project getProject() {
    return project;
  }

  public void setProject(Project project) {
    this.project = project;
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

  public void setAccepted(String acceptedBy) {
    this.accepted = Boolean.TRUE;
    this.acceptedBy = acceptedBy;
    this.acceptedDate = Instant.now();
  }

  public String getAcceptedBy() {
    return acceptedBy;
  }

  public Instant getAcceptedDate() {
    return acceptedDate;
  }

  public String getAuth0UserId() {
    return auth0UserId;
  }

  public void setAuth0UserId(String auth0UserSub) {
    this.auth0UserId = auth0UserSub;
  }

  public Set<Permission> getPermissions() {
    return permissions.stream().map(MemberPermission::getPermission).collect(Collectors.toSet());
  }

  public void setPermissions(Set<Permission> permissions) {
    this.permissions = permissions.stream().map(permission -> new MemberPermission(this, permission)).collect(Collectors.toSet());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Member member = (Member) o;

    return new EqualsBuilder().append(getProject(), member.getProject()).append(getAuth0UserId(), member.getAuth0UserId()).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(getProject()).append(getAuth0UserId()).toHashCode();
  }
}
