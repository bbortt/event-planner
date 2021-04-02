package io.github.bbortt.event.planner.backend.security;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.config.Constants;
import io.github.bbortt.event.planner.backend.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

public class SecurityUtilsIT extends AbstractApplicationContextAwareIT {

    private static final String DEFAULT_LOGIN = "johndoe";

    private static final String DEFAULT_EMAIL = "johndoe@localhost";

    private static final String DEFAULT_FIRSTNAME = "john";

    private static final String DEFAULT_LASTNAME = "doe";

    private static final String DEFAULT_IMAGEURL = "http://placehold.it/50x50";

    private static final String DEFAULT_LANGKEY = "dummy";

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
        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        AdminUserDTO adminUserDTO = SecurityUtils.getCurrentUser().orElseThrow(IllegalArgumentException::new);

        assertThat(adminUserDTO.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(adminUserDTO.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(adminUserDTO.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(adminUserDTO.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(adminUserDTO.isActivated()).isTrue();
        assertThat(adminUserDTO.getLangKey()).isEqualTo(Constants.DEFAULT_LANGUAGE);
        assertThat(adminUserDTO.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
        assertThat(adminUserDTO.getAuthorities()).contains(AuthoritiesConstants.ANONYMOUS);
    }

    @Test
    @Transactional
    void testUserDetailsWithUsername() {
        userDetails.put("preferred_username", "TEST");

        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        AdminUserDTO adminUserDTO = SecurityUtils.getCurrentUser().orElseThrow(IllegalArgumentException::new);

        assertThat(adminUserDTO.getLogin()).isEqualTo("test");
    }

    @Test
    @Transactional
    void testUserDetailsWithLangKey() {
        userDetails.put("langKey", DEFAULT_LANGKEY);
        userDetails.put("locale", "en-US");

        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        AdminUserDTO adminUserDTO = SecurityUtils.getCurrentUser().orElseThrow(IllegalArgumentException::new);

        assertThat(adminUserDTO.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
    }

    @Test
    @Transactional
    void testUserDetailsWithLocale() {
        userDetails.put("locale", "it-IT");

        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        AdminUserDTO adminUserDTO = SecurityUtils.getCurrentUser().orElseThrow(IllegalArgumentException::new);

        assertThat(adminUserDTO.getLangKey()).isEqualTo("it");
    }

    @Test
    @Transactional
    void testUserDetailsWithUSLocaleUnderscore() {
        userDetails.put("locale", "en_US");

        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        AdminUserDTO adminUserDTO = SecurityUtils.getCurrentUser().orElseThrow(IllegalArgumentException::new);

        assertThat(adminUserDTO.getLangKey()).isEqualTo("en");
    }

    @Test
    @Transactional
    void testUserDetailsWithUSLocaleDash() {
        userDetails.put("locale", "en-US");

        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        AdminUserDTO adminUserDTO = SecurityUtils.getCurrentUser().orElseThrow(IllegalArgumentException::new);

        assertThat(adminUserDTO.getLangKey()).isEqualTo("en");
    }
}
