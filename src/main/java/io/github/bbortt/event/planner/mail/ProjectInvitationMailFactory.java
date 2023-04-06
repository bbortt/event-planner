package io.github.bbortt.event.planner.mail;

import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.LocaleResolver;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import tech.jhipster.config.JHipsterProperties;

@Component
public class ProjectInvitationMailFactory {

    private final Logger log = LoggerFactory.getLogger(ProjectInvitationMailFactory.class);

    private static final String TEMPLATE_LOCATION = "mail/project-invitation.html";

    private final String applicationName;
    private final JHipsterProperties.Mail mailProperties;
    private final TemplateEngine templateEngine;
    private final LocaleResolver localeResolver;

    public ProjectInvitationMailFactory(
        @Value("${spring.application.name:event-planner}") String applicationName,
        JHipsterProperties jHipsterProperties,
        TemplateEngine templateEngine,
        LocaleResolver localeResolver
    ) {
        this.applicationName = applicationName;
        this.mailProperties = jHipsterProperties.getMail();
        this.templateEngine = templateEngine;
        this.localeResolver = localeResolver;
    }

    public EmailConfiguration getEmailConfiguration(String invitedEmail, String projectName, String projectToken) {
        log.info("Configure project invitation email");
        return new EmailConfiguration(
            mailProperties.getFrom(),
            invitedEmail,
            String.format("%s: Invitation to Project '%s'.", applicationName, projectName),
            loadHtmlContent(projectName, projectToken)
        );
    }

    private String loadHtmlContent(String projectName, String projectToken) {
        log.debug("Load html content");

        // TODO: I18n
        Context context = new Context(
            localeResolver.resolveLocale(
                getCurrentHttpRequest()
                    .orElseThrow(() -> new IllegalArgumentException("Cannot load i18n'd email outside of servlet context!"))
            )
        );
        context.setVariable("applicationName", applicationName);
        context.setVariable("baseUrl", mailProperties.getBaseUrl());
        context.setVariable("projectName", projectName);

        return this.templateEngine.process(TEMPLATE_LOCATION, context);
    }

    private Optional<HttpServletRequest> getCurrentHttpRequest() {
        log.debug("Read current HTTP servlet request");

        return Optional
            .ofNullable(RequestContextHolder.getRequestAttributes())
            .filter(ServletRequestAttributes.class::isInstance)
            .map(ServletRequestAttributes.class::cast)
            .map(ServletRequestAttributes::getRequest);
    }
}
