package io.github.bbortt.event.planner.apps.projects.domain;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

@Entity
@Table(schema = "projects_service")
public class Permission {

  @Id
  @Size(min = 1, max = 20)
  @Column(nullable = false, updatable = false)
  private String id;

  @OneToMany(mappedBy = "permission")
  private Set<MemberPermission> members = new HashSet<>();

  public String getId() {
    return id;
  }

  public Set<Member> getMembers() {
    return members.stream().map(MemberPermission::getMember).collect(Collectors.toSet());
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
    return new EqualsBuilder().append(getId(), that.getId()).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(getId()).toHashCode();
  }
}
