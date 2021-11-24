package io.github.bbortt.event.planner.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
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
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.springframework.boot.actuate.audit.listener.AuditListener;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

@Table
@Entity
@EntityListeners(AuditListener.class)
public class Member {

  @Id
  @Column(nullable = false, updatable = false)
  @GenericGenerator(
    name = "member_id_seq",
    strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
    parameters = { @Parameter(name = "sequence_name", value = "member_id_seq"), @Parameter(name = "increment_size", value = "1") }
  )
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_id_seq")
  private Long id;

  @NotNull
  @ManyToOne(optional = false)
  @JoinColumn(name = "project_id", nullable = false, updatable = false)
  @JsonIgnoreProperties(value = "members", allowSetters = true)
  private Project project;

  @JsonIgnore
  @CreatedBy
  @Column(nullable = false, length = 50, updatable = false)
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
  @ManyToOne(optional = false)
  @JoinColumn(name = "auth0_user_id", nullable = false, updatable = false)
  @JsonIgnoreProperties(value = "memberships", allowSetters = true)
  private Auth0User auth0User;

  @OneToMany(mappedBy = "member")
  private Set<MemberPermission> permissions = new HashSet<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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

  public Auth0User getAuth0User() {
    return auth0User;
  }

  public void setAuth0User(Auth0User auth0User) {
    this.auth0User = auth0User;
  }

  public Set<MemberPermission> getPermissions() {
    return permissions;
  }

  public void setPermissions(Set<MemberPermission> permissions) {
    this.permissions = permissions;
  }
}
