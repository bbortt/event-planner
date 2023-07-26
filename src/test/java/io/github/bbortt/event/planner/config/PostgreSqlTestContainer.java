package io.github.bbortt.event.planner.config;

import java.util.Collections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.JdbcDatabaseContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;

public class PostgreSqlTestContainer implements SqlTestContainer {

    private static final Logger logger = LoggerFactory.getLogger(PostgreSqlTestContainer.class);

    private PostgreSQLContainer<?> postgreSQLContainer;

    @Override
    public void destroy() {
        if (null != postgreSQLContainer && postgreSQLContainer.isRunning()) {
            postgreSQLContainer.stop();
        }
    }

    @Override
    public void afterPropertiesSet() {
        if (null == postgreSQLContainer) {
            try (PostgreSQLContainer postgreSQLContainer = new PostgreSQLContainer<>("postgres:15.3-alpine")) {
                postgreSQLContainer
                    .withDatabaseName("eventplanner")
                    .withTmpFs(Collections.singletonMap("/testtmpfs", "rw"))
                    .withLogConsumer(new Slf4jLogConsumer(logger))
                    .withReuse(true);
                this.postgreSQLContainer = postgreSQLContainer;
            }
        }
        if (!postgreSQLContainer.isRunning()) {
            postgreSQLContainer.start();
        }
    }

    @Override
    public JdbcDatabaseContainer<?> getTestContainer() {
        return postgreSQLContainer;
    }
}
