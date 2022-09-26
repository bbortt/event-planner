package io.github.bbortt.event.planner.apps.projects.security;

import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

  private SecurityUtils() {
    // Static utility class
  }

  public static Optional<String> getAuth0UserSub() {
    return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication()).map(Authentication::getName);
  }
}
