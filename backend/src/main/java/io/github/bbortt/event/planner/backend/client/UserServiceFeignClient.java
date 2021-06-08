package io.github.bbortt.event.planner.backend.client;

import feign.FeignException;
import io.github.bbortt.event.planner.backend.service.dto.AdminUserDTO;
import io.github.bbortt.event.planner.backend.service.dto.UserDTO;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@AuthorizedFeignClient(
    name = "userService",
    url = "${application.userService.baseUrl}",
    path = "/api/users",
    decode404 = true,
    fallback = UserServiceFeignClientFallback.class
)
public interface UserServiceFeignClient {
    @GetMapping("/{jhiUserId}")
    Optional<UserDTO> getById(@PathVariable("jhiUserId") String jhiUserId) throws FeignException;

    @GetMapping("/findByLogin/{login}")
    Optional<AdminUserDTO> findUserByLogin(@PathVariable("login") String login) throws FeignException;

    @GetMapping("/")
    Set<UserDTO> findAllById(@RequestParam("ids") List<String> jhiUserIds);
}
