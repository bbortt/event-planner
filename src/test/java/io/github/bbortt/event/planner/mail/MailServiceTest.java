package io.github.bbortt.event.planner.mail;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class MailServiceTest {

    private static final String FROM_EMAIL = "eventplanner@localhost";

    @Mock
    private ProjectInvitationMailFactory projectInvitationMailFactoryMock;

    @Mock
    private JavaMailSender javaMailSenderMock;

    private MemberDTO memberDTO;

    private MailService fixture;

    @BeforeEach
    void beforeEachSetup() {
        String toEmail = "doctor-dredd@localhost";
        String projectName = "test-project-name";
        String projectToken = "c357bead-e578-4e5e-b4dd-8ffc60787696";

        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName(projectName);
        projectDTO.setToken(UUID.fromString(projectToken));

        memberDTO = new MemberDTO();
        memberDTO.setInvitedEmail(toEmail);
        memberDTO.setProject(projectDTO);

        fixture = new MailService(projectInvitationMailFactoryMock, javaMailSenderMock);
    }

    @Test
    void sendProjectInvitationEmailSendsEmailUsingJavaMailSender() throws MessagingException {
        String subject = "test-subject";
        String htmlContent = "test-html-content";

        ProjectDTO projectDTO = memberDTO.getProject();
        EmailConfiguration emailConfiguration = new EmailConfiguration(FROM_EMAIL, memberDTO.getInvitedEmail(), subject, htmlContent);
        doReturn(emailConfiguration)
            .when(projectInvitationMailFactoryMock)
            .getEmailConfiguration(memberDTO.getInvitedEmail(), projectDTO.getName(), projectDTO.getToken().toString());

        MimeMessage mimeMessageMock = mock(MimeMessage.class);
        doReturn(mimeMessageMock).when(javaMailSenderMock).createMimeMessage();

        fixture.sendProjectInvitationEmail(memberDTO);

        verify(mimeMessageMock).setFrom(InternetAddress.parse(FROM_EMAIL)[0]);
        verify(mimeMessageMock).setReplyTo(InternetAddress.parse(FROM_EMAIL));
        verify(mimeMessageMock).setSubject(subject, StandardCharsets.UTF_8.toString());
        verify(mimeMessageMock).setRecipient(Message.RecipientType.TO, InternetAddress.parse(memberDTO.getInvitedEmail())[0]);
        verify(mimeMessageMock).setContent(any(Multipart.class));

        verify(javaMailSenderMock).send(mimeMessageMock);
    }

    @Test
    void sendProjectInvitationEmailDoesNotFailWithNullJavaMailSender() {
        ReflectionTestUtils.setField(fixture, "javaMailSender", Optional.empty(), Optional.class);

        String subject = "test-subject";
        String htmlContent = "test-html-content";

        ProjectDTO projectDTO = memberDTO.getProject();
        EmailConfiguration emailConfiguration = new EmailConfiguration(FROM_EMAIL, memberDTO.getInvitedEmail(), subject, htmlContent);
        doReturn(emailConfiguration)
            .when(projectInvitationMailFactoryMock)
            .getEmailConfiguration(memberDTO.getInvitedEmail(), projectDTO.getName(), projectDTO.getToken().toString());

        fixture.sendProjectInvitationEmail(memberDTO);

        verifyNoMoreInteractions(javaMailSenderMock);
    }
}
