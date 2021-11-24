package io.github.bbortt.event.planner.api.v1;

import io.github.bbortt.event.planner.api.v1.UserApi;
import io.github.bbortt.event.planner.api.v1.dto.UserDto;
import io.github.bbortt.event.planner.service.Auth0UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rest/v1")
public class UserApiImpl implements UserApi {

  private final Auth0UserService auth0UserService;

  public UserApiImpl(Auth0UserService userService) {
    this.auth0UserService = userService;
  }

  public ResponseEntity<Void> synchronizeUser(String userId, UserDto userDto) {
    auth0UserService.synchronizeUserById(userId, userDto);

    return ResponseEntity.ok().build();
  }
}
