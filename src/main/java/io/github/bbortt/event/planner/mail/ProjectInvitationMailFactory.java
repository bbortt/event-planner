package io.github.bbortt.event.planner.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;
import tech.jhipster.config.JHipsterProperties;

@Component
public class ProjectInvitationMailFactory {

    private final Logger log = LoggerFactory.getLogger(ProjectInvitationMailFactory.class);

    private static final String TEMPLATE_LOCATION = "mail/project-invitation.html";

    private final ServletRequestUtil servletRequestUtil = new ServletRequestUtil();

    private final String applicationName;
    private final JHipsterProperties.Mail mailProperties;
    private final ITemplateEngine templateEngine;
    private final LocaleResolver localeResolver;

    public ProjectInvitationMailFactory(
        @Value("${spring.application.name:event-planner}") String applicationName,
        JHipsterProperties jHipsterProperties,
        ITemplateEngine templateEngine,
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
            loadHtmlContent(invitedEmail, projectName, projectToken)
        );
    }

    private String loadHtmlContent(String invitedEmail, String projectName, String projectToken) {
        log.debug("Load html content");

        Context context = new Context(
            localeResolver.resolveLocale(
                servletRequestUtil
                    .getCurrentHttpRequest()
                    .orElseThrow(() -> new IllegalArgumentException("Cannot load i18n'd email outside of servlet context!"))
            )
        );

        context.setVariable("applicationName", applicationName);
        context.setVariable("baseUrl", mailProperties.getBaseUrl());
        context.setVariable("invitedEmail", invitedEmail);
        context.setVariable("projectName", projectName);
        context.setVariable("projectToken", projectToken);

        return templateEngine.process(TEMPLATE_LOCATION, context);
    }
}
