package io.github.bbortt.event.planner.backend.config;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;

import io.github.bbortt.event.planner.backend.service.MailService;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class NoOpMailConfiguration {

    private final MailService mockMailService;

    NoOpMailConfiguration() {
        mockMailService = mock(MailService.class);
        doNothing()
            .when(mockMailService)
            .sendEmail(Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyBoolean(), Mockito.anyBoolean());
    }

    @Bean
    MailService mailService() {
        return mockMailService;
    }
}
