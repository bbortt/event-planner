package io.github.bbortt.event.planner.graphql.dto;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class Auth0UserDTO {

  @Id
  private String userId;

  @NotNull
  @Size(min = 1, max = 64)
  private String nickname;

  @NotNull
  @Size(min = 1, max = 64)
  private String email;

  @Size(min = 1, max = 254)
  private String picture;

  @Size(min = 1, max = 128)
  private String familyName;

  @Size(min = 1, max = 128)
  private String givenName;

  @NotNull
  private Set<MemberDTO> memberships = new HashSet<>();

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getNickname() {
    return nickname;
  }

  public void setNickname(String nickname) {
    this.nickname = nickname;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPicture() {
    return picture;
  }

  public void setPicture(String picture) {
    this.picture = picture;
  }

  public String getFamilyName() {
    return familyName;
  }

  public void setFamilyName(String familyName) {
    this.familyName = familyName;
  }

  public String getGivenName() {
    return givenName;
  }

  public void setGivenName(String givenName) {
    this.givenName = givenName;
  }

  public Set<MemberDTO> getMemberships() {
    return memberships;
  }

  public void setMemberships(Set<MemberDTO> memberships) {
    this.memberships = memberships;
  }
}
