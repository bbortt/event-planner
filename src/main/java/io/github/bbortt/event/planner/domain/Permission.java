package io.github.bbortt.event.planner.domain;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
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

  public void setId(String id) {
    this.id = id;
  }

  public Set<MemberPermission> getMembers() {
    return members;
  }

  public void setMembers(Set<MemberPermission> members) {
    this.members = members;
  }
}
