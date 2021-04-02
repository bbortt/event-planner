package io.github.bbortt.event.planner.backend.service;

import io.github.bbortt.event.planner.backend.client.UserServiceFeignClient;
import io.github.bbortt.event.planner.backend.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.backend.service.dto.UserDTO;
import io.github.bbortt.event.planner.backend.service.exception.EntityNotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserServiceFeignClient userServiceClient;

    public UserService(UserServiceFeignClient userServiceClient) {
        this.userServiceClient = userServiceClient;
    }

    public AdminUserDTO findUserByLogin(String login) {
        log.debug("Find User by login : {}", login);
        return userServiceClient.findUserByLogin(login).orElseThrow(EntityNotFoundException::new);
    }

    public Set<UserDTO> findAllById(List<String> jhiUserIds) {
        log.debug("Find users by ids : {}", jhiUserIds);

        Comparator<UserDTO> byEmail = Comparator.comparing(UserDTO::getEmail);
        Supplier<TreeSet<UserDTO>> users = () -> new TreeSet<UserDTO>(byEmail);

        return userServiceClient.findAllById(jhiUserIds).stream().collect(Collectors.toCollection(users));
    }
}
