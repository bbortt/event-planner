package io.github.bbortt.event.planner.test.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

public class SecurityContextUtil {

    public SecurityContextUtil() {
        // Static utility class
    }

    public static void setCurrentUsernameInAuthenticationContext(String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User principal = (User) authentication.getPrincipal();
        ReflectionTestUtils.setField(principal, "username", username, String.class);
    }
}
