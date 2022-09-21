package io.github.bbortt.event.planner.apps.projects.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestJWSBuilderConfiguration {

  private static final Logger logger = LoggerFactory.getLogger(TestJWSBuilderConfiguration.class);

  private static final TestJWSBuilder JWS_BUILDER = TestJWSBuilder.getInstance();

  public TestJWSBuilderConfiguration(
    @Value("${wiremock.server.base-url}") String wireMockServerBaseUrl,
    @Value("${jwt.audience}") String jwtAudience
  ) {
    logger.debug("Updating WireMock for issuer '{}' & audience '{}'", wireMockServerBaseUrl, jwtAudience);

    JWS_BUILDER.setClaimsIssuer(wireMockServerBaseUrl);
    JWS_BUILDER.setClaimsAudience(jwtAudience);
  }

  @Bean
  public TestJWSBuilder testJwsBuilder() {
    return JWS_BUILDER;
  }
}