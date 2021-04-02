package io.github.bbortt.event.planner.backend.service;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.config.Constants;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for {@link UserService}.
 */
@Transactional
class UserServiceIT extends AbstractApplicationContextAwareIT {

    private static final String DEFAULT_LOGIN = "johndoe";

    private static final String DEFAULT_EMAIL = "johndoe@localhost";

    private static final String DEFAULT_FIRSTNAME = "john";

    private static final String DEFAULT_LASTNAME = "doe";

    private static final String DEFAULT_IMAGEURL = "http://placehold.it/50x50";

    private static final String DEFAULT_LANGKEY = "dummy";

    @Autowired
    private UserService userService;

    private Map<String, Object> userDetails;

    @BeforeEach
    public void init() {
        userDetails = new HashMap<>();
        userDetails.put("sub", DEFAULT_LOGIN);
        userDetails.put("email", DEFAULT_EMAIL);
        userDetails.put("given_name", DEFAULT_FIRSTNAME);
        userDetails.put("family_name", DEFAULT_LASTNAME);
        userDetails.put("picture", DEFAULT_IMAGEURL);
    }

    @Test
    @Transactional
    void testDefaultUserDetails() {
        OAuth2AuthenticationToken authentication = TestUtil.createMockOAuth2AuthenticationToken(userDetails);
        TestSecurityContextHolder.setAuthentication(authentication);

        AdminUserDTO userDTO = userService.getCurrentUser();

        assertThat(userDTO.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(userDTO.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(userDTO.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(userDTO.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(userDTO.isActivated()).isTrue();
        assertThat(userDTO.getLangKey()).isEqualTo(Constants.DEFAULT_LANGUAGE);
        assertThat(userDTO.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
        assertThat(userDTO.getAuthorities()).contains(AuthoritiesConstants.ANONYMOUS);
    }

    @Test
    @Transactional
    void testUserDetailsWithUsername() {
        userDetails.put("preferred_username", "TEST");

        OAuth2AuthenticationToken authentication = TestUtil.createMockOAuth2AuthenticationToken(userDetails);
        TestSecurityContextHolder.setAuthentication(authentication);

        AdminUserDTO userDTO = userService.getCurrentUser();

        assertThat(userDTO.getLogin()).isEqualTo("test");
    }

    @Test
    @Transactional
    void testUserDetailsWithLangKey() {
        userDetails.put("langKey", DEFAULT_LANGKEY);
        userDetails.put("locale", "en-US");

        OAuth2AuthenticationToken authentication = TestUtil.createMockOAuth2AuthenticationToken(userDetails);
        TestSecurityContextHolder.setAuthentication(authentication);

        AdminUserDTO userDTO = userService.getCurrentUser();

        assertThat(userDTO.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
    }

    @Test
    @Transactional
    void testUserDetailsWithLocale() {
        userDetails.put("locale", "it-IT");

        OAuth2AuthenticationToken authentication = TestUtil.createMockOAuth2AuthenticationToken(userDetails);
        TestSecurityContextHolder.setAuthentication(authentication);

        AdminUserDTO userDTO = userService.getCurrentUser();

        assertThat(userDTO.getLangKey()).isEqualTo("it");
    }

    @Test
    @Transactional
    void testUserDetailsWithUSLocaleUnderscore() {
        userDetails.put("locale", "en_US");

        OAuth2AuthenticationToken authentication = TestUtil.createMockOAuth2AuthenticationToken(userDetails);
        TestSecurityContextHolder.setAuthentication(authentication);

        AdminUserDTO userDTO = userService.getCurrentUser();

        assertThat(userDTO.getLangKey()).isEqualTo("en");
    }

    @Test
    @Transactional
    void testUserDetailsWithUSLocaleDash() {
        userDetails.put("locale", "en-US");

        OAuth2AuthenticationToken authentication = TestUtil.createMockOAuth2AuthenticationToken(userDetails);
        TestSecurityContextHolder.setAuthentication(authentication);

        AdminUserDTO userDTO = userService.getCurrentUser();

        assertThat(userDTO.getLangKey()).isEqualTo("en");
    }
}
