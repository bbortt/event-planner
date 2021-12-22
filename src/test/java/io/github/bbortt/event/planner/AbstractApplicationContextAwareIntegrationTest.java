package io.github.bbortt.event.planner;

import io.github.bbortt.event.planner.config.TestJWSBuilderConfiguration;
import io.github.bbortt.event.planner.config.WireMockCustomizerConfig;
import io.github.bbortt.event.planner.config.WireMockServerExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@AutoConfigureMockMvc
@ActiveProfiles({ "test" })
@ExtendWith({ WireMockServerExtension.class })
@Import({ WireMockCustomizerConfig.class, TestJWSBuilderConfiguration.class })
@SpringBootTest(classes = { Application.class }, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class AbstractApplicationContextAwareIntegrationTest {}
