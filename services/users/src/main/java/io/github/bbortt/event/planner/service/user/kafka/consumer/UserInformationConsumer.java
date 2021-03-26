package io.github.bbortt.event.planner.service.user.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bbortt.event.planner.service.user.config.KafkaProperties;
import io.github.bbortt.event.planner.service.user.repository.UserRepository;
import io.github.bbortt.event.planner.service.user.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.service.user.service.mapper.UserMapper;
import java.util.Collections;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;

@Component
public class UserInformationConsumer {

    private final Logger log = LoggerFactory.getLogger(UserInformationConsumer.class);

    private static final String TOPIC = "audit";

    private final KafkaReceiver<String, String> receiver;

    private final UserMapper userMapper;
    private final UserRepository userRepository;

    private final ObjectMapper objectMapper;

    public UserInformationConsumer(KafkaProperties kafkaProperties, UserMapper userMapper, UserRepository userRepository) {
        this.receiver = KafkaReceiver.create(ReceiverOptions.<String, String>create(kafkaProperties.getConsumerProps())
            .subscription(Collections.singletonList(TOPIC)));

        this.userMapper = userMapper;
        this.userRepository = userRepository;

        objectMapper = new ObjectMapper();
    }

    @EventListener(ApplicationStartedEvent.class)
    public void consumeAuditEvents() {
        log.info("Starting to consume audit events..");

        receiver.receive()
            .doOnNext(receiverRecord -> receiverRecord.receiverOffset().acknowledge())
            .map(ConsumerRecord::value)
            .<AdminUserDTO>handle((serializedUserDTO, sink) -> {
                try {
                    AdminUserDTO adminUserDTO = objectMapper.readValue(serializedUserDTO, AdminUserDTO.class);
                    sink.next(adminUserDTO);
                } catch (JsonProcessingException e) {
                    sink.error(e);
                }
            })
            .map(userMapper::userDTOToUser)
            .doOnNext(user -> {
                if (log.isDebugEnabled()) {
                    log.debug("Updating user information: {}", user);
                }
            })
            .doOnNext(userRepository::save)
            .subscribe();
    }
}
