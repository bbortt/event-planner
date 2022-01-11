package io.github.bbortt.event.planner.graphql.resolver;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIntegrationTest;
import io.github.bbortt.event.planner.config.TestJWSBuilder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.web.servlet.MockMvc;

class GraphQLEndpointSecurityIntegrationTest extends AbstractApplicationContextAwareIntegrationTest {

  @Autowired
  private TestJWSBuilder testJwsBuilder;

  @Value("${graphql.servlet.mapping}")
  private String graphqlServletMapping;

  @Autowired
  private MockMvc mockMvc;

  @Test
  void cannotAccessGraphqlEndpointWithoutScope() throws Exception {
    String token = testJwsBuilder.build().getCompactSerialization();

    mockMvc.perform(post(graphqlServletMapping).header("authorization", "Bearer " + token)).andExpect(status().isForbidden());
  }
}
