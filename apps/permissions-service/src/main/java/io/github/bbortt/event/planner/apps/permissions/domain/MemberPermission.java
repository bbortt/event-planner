package io.github.bbortt.event.planner.apps.permissions.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.panache.common.Parameters;
import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

@Entity
@IdClass(MemberPermissionId.class)
@Table(name = "member_permission", schema = "permissions_service")
@NamedQueries(
  {
    @NamedQuery(
      name = "MemberPermission.deleteByAuth0UserIdAndProjectId",
      query = "delete from MemberPermission mp" +
      " where mp.permission.id = :permission" +
      "   and mp.member.projectId = :projectId" +
      "   and mp.member.auth0UserId = :auth0UserId"
    ),
  }
)
public class MemberPermission extends PanacheEntityBase {

  @Id
  @NotNull
  @ManyToOne(optional = false)
  @JoinColumn(name = "member_id", nullable = false, updatable = false)
  @JsonIgnoreProperties(value = "permissions", allowSetters = true)
  public Member member;

  @Id
  @NotNull
  @ManyToOne(optional = false)
  @JoinColumn(name = "permission_id", nullable = false, updatable = false)
  @JsonIgnoreProperties(value = "members", allowSetters = true)
  public Permission permission;

  @JsonIgnore
  @Column(name = "created_by", length = 50, nullable = false, updatable = false)
  public String createdBy;

  @JsonIgnore
  @Column(name = "created_date", columnDefinition = "TIMESTAMP WITH TIME ZONE", updatable = false)
  public Instant createdDate = Instant.now();

  @JsonIgnore
  @Column(name = "last_modified_by", length = 50)
  public String lastModifiedBy;

  @JsonIgnore
  @Column(name = "last_modified_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
  public Instant lastModifiedDate = Instant.now();

  public MemberPermission() {
    // Empty member permission
  }

  public MemberPermission(Member member, Permission permission) {
    this.member = member;
    this.permission = permission;
  }

  public static long deleteByAuth0UserIdAndProjectId(String permission, String auth0UserId, long projectId) {
    return delete(
      "#MemberPermission.deleteByAuth0UserIdAndProjectId",
      Parameters.with("permission", permission),
      Parameters.with("projectId", projectId),
      Parameters.with("auth0UserId", auth0UserId)
    );
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    MemberPermission that = (MemberPermission) o;

    return new EqualsBuilder().append(member, that.member).append(permission, that.permission).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(member).append(permission).toHashCode();
  }
}
