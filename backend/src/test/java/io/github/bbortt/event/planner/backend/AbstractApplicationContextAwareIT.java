package io.github.bbortt.event.planner.backend;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ActiveProfiles;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest(classes = { BackendApp.class, TestSecurityConfiguration.class }, webEnvironment = WebEnvironment.RANDOM_PORT)
public abstract class AbstractApplicationContextAwareIT {}
