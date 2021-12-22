package io.github.bbortt.event.planner.api.v1;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import io.github.bbortt.event.planner.config.TestJWSBuilder;
import io.github.bbortt.event.planner.repository.Auth0UserRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

class UserApiIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  @Autowired
  private TestJWSBuilder testJWSBuilder;

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private Auth0UserRepository auth0UserRepository;

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

    assertTrue(auth0UserRepository.findById("auth0|0asfdjnqwer7lk21q347asf8").isPresent());
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

    assertTrue(auth0UserRepository.findById("auth0|0asfdjnqwer7lk21q347asf8").isPresent());
  }
}
