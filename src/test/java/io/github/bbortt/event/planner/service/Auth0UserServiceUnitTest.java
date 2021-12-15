package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.domain.Auth0User;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import java.util.Optional;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class Auth0UserServiceUnitTest {

  private static final String SUB = "auth0|02kjad98fz2qlkjasdf987z2";

  @Mock
  private Auth0UserRepository userRepositoryMock;

  private Auth0UserService fixture;

  @BeforeEach
  void beforeEachSetup() {
    doAnswer((invocation -> invocation.getArgument(0))).when(userRepositoryMock).save(any(Auth0User.class));

    fixture = new Auth0UserService(userRepositoryMock);
  }

  @Test
  void synchronizeUserByIdQueriesExistingUser() {
    Auth0User existingUser = userWithSub();
    doReturn(Optional.of(existingUser)).when(userRepositoryMock).findById(SUB);

    Auth0User synchronizedUser = fixture.synchronizeUserById(SUB, new Auth0User());

    assertEquals(existingUser, synchronizedUser);
  }

  @Test
  void synchronizeUserByIdCreatesUserIfNotExisting() {
    doReturn(Optional.empty()).when(userRepositoryMock).findById(SUB);

    Auth0User synchronizedUser = fixture.synchronizeUserById(SUB, new Auth0User());

    assertEquals(SUB, synchronizedUser.getUserId());
  }

  @Test
  void synchronizeUserByIdCopiesProperties() {
    doReturn(Optional.empty()).when(userRepositoryMock).findById(SUB);

    Auth0User auth0User = userWithSub();
    auth0User.setNickname("nickname");
    auth0User.setEmail("email");
    auth0User.setPicture("picture");
    auth0User.setFamilyName("familyName");
    auth0User.setGivenName("givenName");

    Auth0User synchronizedUser = fixture.synchronizeUserById(SUB, auth0User);

    assertTrue(EqualsBuilder.reflectionEquals(synchronizedUser, auth0User));
  }

  private Auth0User userWithSub() {
    Auth0User auth0User = new Auth0User();
    auth0User.setUserId(SUB);
    return auth0User;
  }
}
