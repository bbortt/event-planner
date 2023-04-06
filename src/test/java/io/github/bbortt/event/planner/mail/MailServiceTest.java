package io.github.bbortt.event.planner.mail;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import tech.jhipster.config.JHipsterProperties;

@ExtendWith(MockitoExtension.class)
class MailServiceTest {

    private static final String APPLICATION_NAME = "test-application-name";
    private static final String FROM_EMAIL = "test-from-email";

    @Mock
    private JavaMailSender javaMailSenderMock;

    private JHipsterProperties jHipsterProperties;

    private MailService fixture;

    @BeforeEach
    void beforeEachSetup() {
        jHipsterProperties = new JHipsterProperties();
        jHipsterProperties.getMail().setFrom(FROM_EMAIL);

        fixture = new MailService(APPLICATION_NAME, jHipsterProperties, javaMailSenderMock);
    }
    //    @Test
    //    void mailSendingIsOptional() {
    //        ReflectionTestUtils.setField(fixture, "mailService", Optional.empty(), Optional.class);
    //
    //        ProjectDTO projectDTO = new ProjectDTO();
    //        projectDTO.setId(1234L);
    //
    //        MemberDTO memberDTO = new MemberDTO();
    //        memberDTO.setInvitedEmail("edith-freiberg@localhost");
    //        memberDTO.setProject(projectDTO);
    //
    //        inviteToProject(memberDTO.getInvitedEmail(), new Project(), memberDTO);
    //    }
}
