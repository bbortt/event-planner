package io.github.bbortt.event.planner.service.user;

import io.github.bbortt.event.planner.service.user.UsersApp;
import io.github.bbortt.event.planner.service.user.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { UsersApp.class, TestSecurityConfiguration.class })
public @interface IntegrationTest {
}
