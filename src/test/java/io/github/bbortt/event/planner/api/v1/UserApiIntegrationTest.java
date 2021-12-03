package io.github.bbortt.event.planner.api.v1;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import java.io.File;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

class UserApiIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void synchronizeUser() throws Exception {
    File contentFile = new File(getClass().getClassLoader().getResource("data/UserApiIntegrationTest/synchronizeUser.json").getFile());
    String content = FileUtils.readFileToString(contentFile, "UTF-8");

    mockMvc.perform(put("/api/rest/v1/user/auth0|0asfdjnqwer7lk21q347asf8").content(content).with(jwt()));
  }
}
