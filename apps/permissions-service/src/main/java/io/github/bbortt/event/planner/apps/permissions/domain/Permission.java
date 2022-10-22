package io.github.bbortt.event.planner.apps.permissions.domain;

import io.github.bbortt.event.planner.apps.permissions.domain.query.PermissionId;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.panache.common.Parameters;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

@Entity
@Table(name = "permission", schema = "permissions_service")
@NamedQueries(
  {
    @NamedQuery(
      name = "Permission.findAllByAuth0UserIdAndProjectId",
      query = "select mp.permission from MemberPermission mp" +
      " where mp.member.projectId = :projectId" +
      "   and mp.member.auth0UserId = :auth0UserId"
    ),
  }
)
public class Permission extends PanacheEntityBase {

  @Id
  @Size(min = 1, max = 20)
  @Column(nullable = false, updatable = false)
  public String id;

  @OneToMany(mappedBy = "permission")
  public Set<MemberPermission> members = new HashSet<>();

  public static List<String> findAllByAuth0UserIdAndProjectId(String auth0UserId, Long projectId) {
    return find(
      "#Permission.findAllByAuth0UserIdAndProjectId",
      Parameters.with("projectId", projectId),
      Parameters.with("auth0UserId", auth0UserId)
    )
      .project(PermissionId.class)
      .list()
      .stream()
      .map(permissionId -> permissionId.id)
      .toList();
  }

  public Set<Member> getMembers() {
    return members.stream().map(mp -> mp.member).collect(Collectors.toSet());
  }

  public void setMembers(Set<Member> members) {
    this.members = members.stream().map(member -> new MemberPermission(member, this)).collect(Collectors.toSet());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Permission that = (Permission) o;

    // Noted: It's ok to use the @Id here, because this entity will *always* be persisted!
    return new EqualsBuilder().append(id, that.id).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(id).toHashCode();
  }
}
