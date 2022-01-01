package io.github.bbortt.event.planner.api.v1;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import io.github.bbortt.event.planner.config.TestJWSBuilder;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import java.nio.file.Files;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

class UserApiIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  private static final String USER_ID = "auth0|0asfdjnqwer7lk21q347asf8";

  @Autowired
  private TestJWSBuilder testJWSBuilder;

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private Auth0UserRepository userRepository;

  @Test
  void synchronizeUser() throws Exception {
    String token = testJWSBuilder.build("user:synchronize").getCompactSerialization();
    String content = Files.readString(new ClassPathResource("data/UserApiIntegrationTest/synchronizeUser.json").getFile().toPath());

    mockMvc
      .perform(
        put("/api/rest/v1/user/auth0|0asfdjnqwer7lk21q347asf8")
          .content(content)
          .contentType(MediaType.APPLICATION_JSON)
          .header("authorization", "bearer " + token)
      )
      .andExpect(status().isOk());

    assertTrue(userRepository.findById(USER_ID).isPresent());
  }

  @Test
  void cannotSynchronizeUserWithoutScope() throws Exception {
    String token = testJWSBuilder.build().getCompactSerialization();
    String content = Files.readString(new ClassPathResource("data/UserApiIntegrationTest/synchronizeUser.json").getFile().toPath());

    mockMvc
      .perform(
        put("/api/rest/v1/user/auth0|0asfdjnqwer7lk21q347asf8")
          .content(content)
          .contentType(MediaType.APPLICATION_JSON)
          .header("authorization", "bearer " + token)
      )
      .andExpect(status().isForbidden());

    assertTrue(userRepository.findById(USER_ID).isEmpty());
  }

  @AfterEach
  void afterEachTeardown() {
    userRepository.findById(USER_ID).ifPresent(userRepository::delete);
  }
}
