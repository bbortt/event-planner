package io.github.bbortt.event.planner.api.v1;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.api.v1.dto.UserDto;
import io.github.bbortt.event.planner.domain.Auth0User;
import io.github.bbortt.event.planner.service.Auth0UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class UserApiImplUnitTest {

  @Mock
  private Auth0UserService auth0UserServiceMock;

  @Mock
  private ConversionService conversionServiceMock;

  private UserApiImpl fixture;

  @BeforeEach
  void beforeEachSetup() {
    fixture = new UserApiImpl(auth0UserServiceMock, conversionServiceMock);
  }

  @Test
  void synchronizeUserCallsService() {
    String sub = "auth0|jlajsdf89hlaksdjf72ljkh3";
    UserDto userDto = new UserDto();

    Auth0User auth0User = new Auth0User();
    doReturn(auth0User).when(conversionServiceMock).convert(userDto, Auth0User.class);

    ResponseEntity<Void> response = fixture.synchronizeUser(sub, userDto);

    assertEquals(HttpStatus.OK, response.getStatusCode());

    verify(auth0UserServiceMock).synchronizeUserById(sub, auth0User);
  }
}
