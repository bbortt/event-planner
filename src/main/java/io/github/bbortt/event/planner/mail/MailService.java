package io.github.bbortt.event.planner.mail;

import static io.github.bbortt.event.planner.config.Constants.SPRING_PROFILE_MAIL;

import io.github.bbortt.event.planner.service.dto.MemberDTO;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Profile(SPRING_PROFILE_MAIL)
public class MailService {

    private final JavaMailSender javaMailSender;

    public MailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendInvitationEmail(MemberDTO memberDTO) {
        throw new NotImplementedException();
    }
}
