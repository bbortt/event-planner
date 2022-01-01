package io.github.bbortt.event.planner.domain;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.*;
import javax.validation.constraints.Size;

@Table
@Entity
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
}
