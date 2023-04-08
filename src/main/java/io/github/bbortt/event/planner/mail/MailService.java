package io.github.bbortt.event.planner.mail;

import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import javax.annotation.Nullable;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Lazy
@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(MailService.class);

    private final ProjectInvitationMailFactory projectInvitationMailFactory;
    private final Optional<JavaMailSender> javaMailSender;

    public MailService(
        ProjectInvitationMailFactory projectInvitationMailFactory,
        @Nullable @Autowired(required = false) JavaMailSender javaMailSender
    ) {
        this.projectInvitationMailFactory = projectInvitationMailFactory;
        this.javaMailSender = Optional.ofNullable(javaMailSender);
    }

    public void sendProjectInvitationEmail(MemberDTO memberDTO) {
        log.info("Request to send project invitation email to new member: {}", memberDTO);

        ProjectDTO projectDTO = memberDTO.getProject();

        final EmailConfiguration emailConfiguration = projectInvitationMailFactory.getEmailConfiguration(
            memberDTO.getInvitedEmail(),
            projectDTO.getName(),
            projectDTO.getToken().toString()
        );
        logEmailConfigurationForDisabledMailing(emailConfiguration);

        javaMailSender.ifPresent(mailSender -> sendProjectInvitationEmail(emailConfiguration, mailSender));
    }

    private void logEmailConfigurationForDisabledMailing(EmailConfiguration emailConfiguration) {
        if (javaMailSender.isEmpty() && !log.isDebugEnabled()) {
            log.info(
                "Mailing is disabled, invitation link sent to '{}' would be:\n{}",
                emailConfiguration.toEmail(),
                emailConfiguration.htmlContent()
            );
        }
    }

    private void sendProjectInvitationEmail(EmailConfiguration emailConfiguration, JavaMailSender mailSender) {
        if (log.isDebugEnabled()) {
            log.debug("Send project invitation email to '{}':\n{}", emailConfiguration.toEmail(), emailConfiguration.htmlContent());
        }

        try {
            mailSender.send(getMimeMessage(emailConfiguration, mailSender));
        } catch (MessagingException e) {
            log.error("Failed to create email '{}' to '{}'!", emailConfiguration.subject(), emailConfiguration.toEmail(), e);
            throw new IllegalArgumentException("Failed to create email!", e);
        }
    }

    private MimeMessage getMimeMessage(EmailConfiguration emailConfiguration, JavaMailSender mailSender) throws MessagingException {
        if (log.isDebugEnabled()) {
            log.debug(
                "Construct MIME message for message with subject '{}' to '{}'",
                emailConfiguration.subject(),
                emailConfiguration.toEmail()
            );
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.toString());

        message.setFrom(emailConfiguration.fromEmail());
        message.setReplyTo(emailConfiguration.fromEmail());
        message.setSubject(emailConfiguration.subject());
        message.setTo(emailConfiguration.toEmail());

        message.setText(emailConfiguration.htmlContent(), true);

        return mimeMessage;
    }
}
