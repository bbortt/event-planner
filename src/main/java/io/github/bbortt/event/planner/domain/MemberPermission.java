package io.github.bbortt.event.planner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Table
@Entity
@IdClass(MemberPermissionId.class)
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
}
