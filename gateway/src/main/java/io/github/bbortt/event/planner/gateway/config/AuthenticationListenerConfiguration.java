package io.github.bbortt.event.planner.gateway.config;

import io.github.bbortt.event.planner.gateway.service.UserService;
import io.github.bbortt.event.planner.gateway.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderOptions;
import reactor.kafka.sender.SenderRecord;
import reactor.kafka.sender.SenderResult;

@Configuration
public class AuthenticationListenerConfiguration {

    private final Logger log = LoggerFactory.getLogger(AuthenticationListenerConfiguration.class);

    private static final String TOPIC = "audit";

    private final UserService userService;
    private final KafkaSender<String, UserDTO> sender;

    public AuthenticationListenerConfiguration(KafkaProperties kafkaProperties, UserService userService) {
        this.userService = userService;
        this.sender = KafkaSender.create(SenderOptions.create(kafkaProperties.getProducerProps()));
    }

    @EventListener
    public void authenticationSuccessEventListener(AuthenticationSuccessEvent authenticationSuccessEvent) {
        userService
            .getUserFromAuthentication((AbstractAuthenticationToken) authenticationSuccessEvent.getAuthentication())
            .doOnNext(
                user -> {
                    if (log.isDebugEnabled()) {
                        log.debug("Authentication success: {}", user);
                    }
                }
            )
            .map(user -> SenderRecord.create(TOPIC, null, null, user.getId(), user, null))
            .as(sender::send)
            .next()
            .map(SenderResult::recordMetadata)
            .subscribe(
                recordMetadata -> {
                    if (log.isDebugEnabled()) {
                        log.debug(
                            "Audit published: { topic: {}, partition: {}, offset: {}, timestamp: {} }",
                            recordMetadata.topic(),
                            recordMetadata.partition(),
                            recordMetadata.offset(),
                            recordMetadata.timestamp()
                        );
                    }
                }
            );
    }
}
