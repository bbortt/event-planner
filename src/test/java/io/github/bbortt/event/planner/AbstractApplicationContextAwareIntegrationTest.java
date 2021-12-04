package io.github.bbortt.event.planner;

import io.github.bbortt.event.planner.config.WireMockCustomizerConfig;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.context.annotation.Import;

@AutoConfigureMockMvc
@AutoConfigureWireMock(port = 0)
@Import({ WireMockCustomizerConfig.class })
@SpringBootTest(classes = { Application.class }, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class AbstractApplicationContextAwareIntegrationTest {}
