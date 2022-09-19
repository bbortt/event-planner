package io.github.bbortt.event.planner.apps.projects.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

@Entity
@IdClass(MemberPermissionId.class)
@Table(schema = "projects_service")
public class MemberPermission extends AbstractAuditingEntity {

  @Id
  @NotNull
  @ManyToOne(optional = false)
  @JoinColumn(name = "member_id", nullable = false, updatable = false)
  @JsonIgnoreProperties(value = "permissions", allowSetters = true)
  private Member member;

  @Id
  @NotNull
  @ManyToOne(optional = false)
  @JoinColumn(name = "permission_id", nullable = false, updatable = false)
  @JsonIgnoreProperties(value = "members", allowSetters = true)
  private Permission permission;

  public MemberPermission() {
    // Empty member permission
  }

  public MemberPermission(Member member, Permission permission) {
    this.member = member;
    this.permission = permission;
  }

  public Member getMember() {
    return member;
  }

  public void setMember(Member member) {
    this.member = member;
  }

  public Permission getPermission() {
    return permission;
  }

  public void setPermission(Permission permission) {
    this.permission = permission;
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

    return new EqualsBuilder().append(getMember(), that.getMember()).append(getPermission(), that.getPermission()).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(getMember()).append(getPermission()).toHashCode();
  }
}
