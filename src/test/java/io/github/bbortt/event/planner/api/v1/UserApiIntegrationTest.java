package io.github.bbortt.event.planner.api.v1;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

class UserApiIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private Auth0UserRepository auth0UserRepository;

  @Test
  void synchronizeUser() throws Exception {
    String content = Files.readString(Path.of("classpath:data/UserApiIntegrationTest/synchronizeUser.json"));
    mockMvc.perform(put("/api/rest/v1/user/auth0|0asfdjnqwer7lk21q347asf8").content(content).with(jwt())).andExpect(status().isOk());

    assertTrue(auth0UserRepository.findById("auth0|0asfdjnqwer7lk21q347asf8").isPresent());
  }
}
