package io.github.bbortt.event.planner;

import io.github.bbortt.event.planner.config.AsyncSyncConfiguration;
import io.github.bbortt.event.planner.config.EmbeddedRedis;
import io.github.bbortt.event.planner.config.EmbeddedSQL;
import io.github.bbortt.event.planner.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@EmbeddedSQL
@EmbeddedRedis
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { EventPlannerApp.class, AsyncSyncConfiguration.class, TestSecurityConfiguration.class })
public @interface IntegrationTest {
}
