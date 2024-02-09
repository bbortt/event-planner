package io.github.bbortt.event.planner.mail;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.springframework.web.context.request.RequestContextHolder.setRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.LocaleResolver;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;
import tech.jhipster.config.JHipsterProperties;

@ExtendWith(MockitoExtension.class)
class ProjectInvitationMailFactoryTest {

    private static final String APPLICATION_NAME = "event-planner";
    private static final String FROM_EMAIL = "event-planner@test";

    @Mock
    private HttpServletRequest httpServletRequestMock;

    @Mock
    private ITemplateEngine templateEngineMock;

    @Mock
    private LocaleResolver localeResolverMock;

    private JHipsterProperties jhipsterProperties;

    private ProjectInvitationMailFactory fixture;

    @BeforeEach
    void beforeEachSetup() {
        jhipsterProperties = new JHipsterProperties();
        jhipsterProperties.getMail().setFrom(FROM_EMAIL);

        setRequestAttributes(new ServletRequestAttributes(httpServletRequestMock));

        fixture = new ProjectInvitationMailFactory(APPLICATION_NAME, jhipsterProperties, templateEngineMock, localeResolverMock);
    }

    @Test
    void getEmailConfigurationReturnsConfiguration() {
        String invitedEmail = "ryoko-saguri@localhost";
        String projectName = "test-project-name";
        String projectToken = "0e95e627-66f0-42d0-8aa3-292e3bd428b6";

        String htmlContent = "test-html-content";
        doReturn(htmlContent).when(templateEngineMock).process(eq("mail/project-invitation.html"), any(Context.class));

        EmailConfiguration result = fixture.getEmailConfiguration(invitedEmail, projectName, projectToken);
        assertEquals(FROM_EMAIL, result.fromEmail());
        assertEquals(invitedEmail, result.toEmail());
        assertEquals("event-planner: Invitation to Project 'test-project-name'.", result.subject());
        assertEquals(htmlContent, result.htmlContent());

        verify(localeResolverMock).resolveLocale(httpServletRequestMock);
    }
}
