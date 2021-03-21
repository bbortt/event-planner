package io.github.bbortt.event.planner;

import io.github.bbortt.event.planner.config.TestSecurityConfiguration;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@AutoConfigureMockMvc
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {BackendApp.class, TestSecurityConfiguration.class}, webEnvironment = WebEnvironment.RANDOM_PORT)
public abstract class AbstractApplicationContextAwareIT {}
