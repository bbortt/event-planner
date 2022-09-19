package io.github.bbortt.event.planner.apps.projects;

import io.github.bbortt.event.planner.apps.projects.config.TestJWSBuilderConfiguration;
import io.github.bbortt.event.planner.apps.projects.config.WireMockCustomizerConfig;
import io.github.bbortt.event.planner.apps.projects.config.WireMockServerExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@AutoConfigureMockMvc
@ActiveProfiles({ "test" })
@ExtendWith({ WireMockServerExtension.class })
@Import({ WireMockCustomizerConfig.class, TestJWSBuilderConfiguration.class })
@SpringBootTest(classes = { ProjectsServiceApplication.class }, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class AbstractApplicationContextAwareIntegrationTest {}
