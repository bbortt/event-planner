package io.github.bbortt.event.planner.apps.projects.domain;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Serial;
import java.io.Serializable;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

public class MemberPermissionId implements Serializable {

  @Serial
  private static final long serialVersionUID = 1L;

  private final transient ObjectMapper objectMapper = new ObjectMapper();

  private Member member;
  private Permission permission;

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

    MemberPermissionId that = (MemberPermissionId) o;

    return new EqualsBuilder().append(getMember(), that.getMember()).append(getPermission(), that.getPermission()).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(getMember()).append(getPermission()).toHashCode();
  }

  @Serial
  private void writeObject(java.io.ObjectOutputStream out) throws IOException {
    objectMapper.writeValue((OutputStream) out, this);
  }

  @Serial
  private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException {
    MemberPermissionId memberPermissionId = objectMapper.readValue(in.readAllBytes(), MemberPermissionId.class);
    setMember(memberPermissionId.getMember());
    setPermission(memberPermissionId.getPermission());
  }
}
