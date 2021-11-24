package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.api.v1.dto.UserDto;
import io.github.bbortt.event.planner.domain.Auth0User;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class Auth0UserService {

  private final Auth0UserRepository userRepository;

  public Auth0UserService(Auth0UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public void synchronizeUserById(String id, UserDto userDto) {
    Auth0User auth0User = userRepository.findById(id).orElseGet(() -> newAuth0UserWithId(id));

    BeanUtils.copyProperties(userDto, auth0User, Auth0UserUpdateSafe.class);

    userRepository.save(auth0User);
  }

  private Auth0User newAuth0UserWithId(String id) {
    Auth0User auth0User = new Auth0User();
    auth0User.setUserId(id);
    return auth0User;
  }

  public interface Auth0UserUpdateSafe {
    void setNickname(String nickname);

    void setEmail(String email);

    void setPicture(String picture);

    void setGivenName(String givenName);

    void setFamilyName(String familyName);
  }
}
