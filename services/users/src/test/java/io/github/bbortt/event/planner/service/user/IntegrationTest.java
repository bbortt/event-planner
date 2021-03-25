package io.github.bbortt.event.planner.service.user;

import io.github.bbortt.event.planner.service.user.config.TestSecurityConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { UserApp.class, TestSecurityConfiguration.class })
public @interface IntegrationTest {
}
