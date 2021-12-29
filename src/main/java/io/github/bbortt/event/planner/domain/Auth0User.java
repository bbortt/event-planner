package io.github.bbortt.event.planner.domain;

import io.github.bbortt.event.planner.service.Auth0UserService.Auth0UserUpdateSafe;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "auth0_user")
public class Auth0User implements Auth0UserUpdateSafe {

  @Id
  @Column(nullable = false, updatable = false)
  private String userId;

  @NotNull
  @Size(min = 1, max = 64)
  @Column(nullable = false, updatable = false)
  private String nickname;

  @NotNull
  @Size(min = 1, max = 64)
  @Column(nullable = false, updatable = false)
  private String email;

  @Column
  @Size(min = 1, max = 254)
  private String picture;

  @Column
  @Size(min = 1, max = 128)
  private String familyName;

  @Column
  @Size(min = 1, max = 128)
  private String givenName;

  @OneToMany(mappedBy = "auth0User")
  private Set<Member> memberships = new HashSet<>();

  public Auth0User() {
    // Empty Auth0 user
  }

  public Auth0User(String userId, String nickname, String email) {
    this.userId = userId;
    this.nickname = nickname;
    this.email = email;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getNickname() {
    return nickname;
  }

  @Override
  public void setNickname(String nickname) {
    this.nickname = nickname;
  }

  public String getEmail() {
    return email;
  }

  @Override
  public void setEmail(String email) {
    this.email = email;
  }

  public String getPicture() {
    return picture;
  }

  @Override
  public void setPicture(String picture) {
    this.picture = picture;
  }

  public String getFamilyName() {
    return familyName;
  }

  @Override
  public void setFamilyName(String familyName) {
    this.familyName = familyName;
  }

  public String getGivenName() {
    return givenName;
  }

  @Override
  public void setGivenName(String givenName) {
    this.givenName = givenName;
  }

  public Set<Member> getMemberships() {
    return memberships;
  }

  public void setMemberships(Set<Member> memberships) {
    this.memberships = memberships;
  }
}
