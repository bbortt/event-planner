package io.github.bbortt.event.planner.mail;

import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.Locale.forLanguageTag;
import static java.util.Objects.requireNonNull;
import static java.util.UUID.fromString;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.parallel.ExecutionMode.SAME_THREAD;
import static org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE_REQUEST_ATTRIBUTE_NAME;

import io.github.bbortt.event.planner.IntegrationTest;
import java.io.IOException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.parallel.Execution;
import org.springframework.beans.factory.annotation.Autowired;
import org.testcontainers.shaded.org.apache.commons.io.IOUtils;

@IntegrationTest
@Execution(SAME_THREAD)
class ProjectInvitationMailFactoryIT {

    private static final String FROM_EMAIL = "melissa-joan-gold@localhost";
    private static final String PROJECT_NAME = "test-project-name";
    private static final UUID PROJECT_TOKEN = fromString("68158cf4-47ff-4fc0-85d6-6f06d5a60852");

    @Autowired
    private ProjectInvitationMailFactory projectInvitationMailFactory;

    @Test
    void getEmailConfiguration() throws IOException {
        var httpServletRequest = new ServletRequestUtil().getCurrentHttpRequest().orElseThrow();

        httpServletRequest.removeAttribute(LOCALE_REQUEST_ATTRIBUTE_NAME);
        httpServletRequest.setAttribute(LOCALE_REQUEST_ATTRIBUTE_NAME, forLanguageTag("en"));

        var expectedContent = IOUtils.toString(
            requireNonNull(getClass().getClassLoader().getResourceAsStream("integration-test/ProjectInvitationMailFactoryIT/en.html")),
            UTF_8
        );

        assertThat(projectInvitationMailFactory.getEmailConfiguration(FROM_EMAIL, PROJECT_NAME, PROJECT_TOKEN.toString()))
            .extracting(EmailConfiguration::htmlContent)
            .isEqualTo(expectedContent);
    }
}
