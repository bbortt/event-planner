package io.github.bbortt.event.planner.service.user.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bbortt.event.planner.service.user.domain.User;
import io.github.bbortt.event.planner.service.user.service.UserService;
import io.github.bbortt.event.planner.service.user.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.service.user.service.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class UserInformationConsumer {

    private static  final Logger log = LoggerFactory.getLogger(UserInformationConsumer.class);

    private static final String TOPIC = "audit";

    private final UserMapper userMapper;
    private final UserService userService;

    private final ObjectMapper objectMapper;

    public UserInformationConsumer(UserMapper userMapper, UserService userService) {
        this.userMapper = userMapper;
        this.userService = userService;

        objectMapper = new ObjectMapper();
    }

    @KafkaListener(topics = {TOPIC}, containerFactory = "groupedListenerContainerFactory")
    public void consumeUserInformation(String userInformation) throws JsonProcessingException {
        log.info("Starting to consume audit events..");

        AdminUserDTO adminUserDTO = objectMapper.readValue(userInformation, AdminUserDTO.class);
        User user = userMapper.userDTOToUser(adminUserDTO);

        if (log.isDebugEnabled()) {
            log.debug("Updating user information: {}", user);
        }

        userService.syncUser(user);
    }
}
