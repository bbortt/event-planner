package io.github.bbortt.event.planner.backend.client;

import io.github.bbortt.event.planner.backend.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.backend.service.dto.UserDTO;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

public class UserServiceFeignClientFallback implements UserServiceFeignClient {

    @Override
    public Optional<UserDTO> getById(@PathVariable("jhiUserId") String jhiUserId) {
        return Optional.empty();
    }

    @Override
    public Optional<AdminUserDTO> findUserByLogin(@PathVariable("login") String login) {
        return Optional.empty();
    }

    @Override
    public Set<UserDTO> findAllById(@RequestParam("ids") List<String> jhiUserIds) {
        return new HashSet<>();
    }
}
