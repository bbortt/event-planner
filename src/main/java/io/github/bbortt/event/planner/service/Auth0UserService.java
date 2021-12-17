package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Auth0User;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class Auth0UserService {

  private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

  private final Auth0UserRepository userRepository;

  public Auth0UserService(Auth0UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Transactional
  public Auth0User synchronizeUserById(String id, Auth0User updatedUser) {
    Auth0User persistedUser = userRepository.findById(id).orElseGet(() -> newAuth0UserWithId(id));
    BeanUtils.copyProperties(updatedUser, persistedUser, Auth0UserUpdateSafe.class);

    logger.debug("Updated auth0 user '{}': {}", id, persistedUser);

    return userRepository.save(persistedUser);
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
