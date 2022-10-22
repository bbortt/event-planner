package io.github.bbortt.event.planner.apps.permissions.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.github.bbortt.event.planner.apps.permissions.domain.query.MemberProjectId;
import io.github.bbortt.event.planner.common.postgresql.PostgreSQLConstants;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(
  name = "member",
  schema = "permissions_service",
  uniqueConstraints = { @UniqueConstraint(name = "unique_user_per_project", columnNames = { "project_id", "auth0_user_id" }) }
)
public class Member extends PanacheEntityBase {

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
  public Long id;

  @NotNull
  @Column(name = "project_id")
  public Long projectId;

  @NotNull
  @JsonIgnore
  @Column(name = "created_by", length = 50, nullable = false, updatable = false)
  public String createdBy;

  @JsonIgnore
  @Column(name = "created_date", updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
  public Instant createdDate = Instant.now();

  @NotNull
  @Column(nullable = false)
  public Boolean accepted = Boolean.FALSE;

  @JsonIgnore
  @Column(name = "accepted_by", length = 50)
  public String acceptedBy;

  @JsonIgnore
  @Column(name = "accepted_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
  public Instant acceptedDate = Instant.now();

  @NotNull
  @Column(name = "auth0_user_id", length = 64, nullable = false, updatable = false)
  public String auth0UserId;

  @OneToMany(mappedBy = "member", cascade = { CascadeType.ALL })
  public Set<MemberPermission> permissions = new HashSet<>();

  public Member() {
    // Empty member
  }

  public Member(Long projectId, String auth0UserId) {
    this.projectId = projectId;
    this.auth0UserId = auth0UserId;
  }

  public static List<Long> findProjectIdsByAuth0UserId(String auth0UserId) {
    return find("auth0UserId", auth0UserId)
      .project(MemberProjectId.class)
      .list()
      .stream()
      .map(memberProjectId -> memberProjectId.projectId)
      .toList();
  }

  public void setAccepted(String acceptedBy) {
    this.accepted = Boolean.TRUE;
    this.acceptedBy = acceptedBy;
    this.acceptedDate = Instant.now();
  }

  public Set<Permission> getPermissions() {
    return permissions.stream().map(mp -> mp.permission).collect(Collectors.toSet());
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

    return new EqualsBuilder().append(projectId, member.projectId).append(auth0UserId, member.auth0UserId).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(projectId).append(auth0UserId).toHashCode();
  }
}
