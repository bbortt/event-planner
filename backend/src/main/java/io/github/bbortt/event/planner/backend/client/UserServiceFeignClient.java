package io.github.bbortt.event.planner.backend.client;

import io.github.bbortt.event.planner.backend.service.dto.AdminUserDTO;
import java.util.Optional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@AuthorizedFeignClient(name = "userService", url = "${application.userService.baseUrl}", path = "/api/users")
public interface UserServiceFeignClient {
    @GetMapping("findOneByLogin")
    Optional<AdminUserDTO> findUserByLogin(@RequestParam("login") String login);
}
