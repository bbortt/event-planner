package io.github.bbortt.event.planner.api.v1.converter;

import io.github.bbortt.event.planner.api.v1.dto.UserDto;
import io.github.bbortt.event.planner.domain.Auth0User;
import org.springframework.core.convert.converter.Converter;

public class V1UserDtoToAuth0UserConverter implements Converter<UserDto, Auth0User> {

  @Override
  public Auth0User convert(UserDto source) {
    Auth0User auth0User = new Auth0User();
    auth0User.setNickname(source.getNickname());
    auth0User.setEmail(source.getEmail());
    auth0User.setPicture(source.getPicture());
    auth0User.setFamilyName(source.getFamilyName());
    return auth0User;
  }
}
