package io.github.bbortt.event.planner.mail;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE_REQUEST_ATTRIBUTE_NAME;

import io.github.bbortt.event.planner.IntegrationTest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.testcontainers.shaded.org.apache.commons.io.IOUtils;

@IntegrationTest
class ProjectInvitationMailFactoryIT {

    private static final String FROM_EMAIL = "melissa-joan-gold@localhost";
    private static final String PROJECT_NAME = "test-project-name";
    private static final UUID PROJECT_TOKEN = UUID.fromString("68158cf4-47ff-4fc0-85d6-6f06d5a60852");

    @Autowired
    private ProjectInvitationMailFactory projectInvitationMailFactory;

    public static Stream<Arguments> getEmailConfiguration() {
        return Stream.of(Arguments.of("en"), Arguments.of("de"));
    }

    @MethodSource
    @ParameterizedTest
    void getEmailConfiguration(String language) throws IOException {
        new ServletRequestUtil()
            .getCurrentHttpRequest()
            .orElseThrow(IllegalArgumentException::new)
            .setAttribute(LOCALE_REQUEST_ATTRIBUTE_NAME, Locale.forLanguageTag(language));

        assertEquals(
            IOUtils.toString(
                Objects.requireNonNull(
                    getClass().getClassLoader().getResourceAsStream("integration-test/ProjectInvitationMailFactoryIT/" + language + ".html")
                ),
                StandardCharsets.UTF_8
            ),
            projectInvitationMailFactory.getEmailConfiguration(FROM_EMAIL, PROJECT_NAME, PROJECT_TOKEN.toString()).htmlContent()
        );
    }
}
