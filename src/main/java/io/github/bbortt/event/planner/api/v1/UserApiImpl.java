package io.github.bbortt.event.planner.api.v1;

import io.github.bbortt.event.planner.api.v1.dto.UserDto;
import io.github.bbortt.event.planner.domain.Auth0User;
import io.github.bbortt.event.planner.service.Auth0UserService;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rest/v1")
public class UserApiImpl implements UserApi {

  private final Auth0UserService userService;
  private final ConversionService conversionService;

  public UserApiImpl(Auth0UserService userService, ConversionService conversionService) {
    this.userService = userService;
    this.conversionService = conversionService;
  }

  @Override
  public ResponseEntity<Void> synchronizeUser(String userId, UserDto userDto) {
    Auth0User auth0User = conversionService.convert(userDto, Auth0User.class);
    userService.synchronizeUserById(userId, auth0User);

    return ResponseEntity.ok().build();
  }
}
