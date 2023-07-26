package io.github.bbortt.event.planner.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;

public class RedisTestContainer implements InitializingBean, DisposableBean {

    private static final Logger logger = LoggerFactory.getLogger(RedisTestContainer.class);

    private GenericContainer redisContainer;

    @Override
    public void destroy() {
        if (null != redisContainer && redisContainer.isRunning()) {
            redisContainer.close();
        }
    }

    @Override
    public void afterPropertiesSet() {
        if (null == redisContainer) {
            redisContainer =
                new GenericContainer("redis:7.0.12-alpine")
                    .withExposedPorts(6379)
                    .withLogConsumer(new Slf4jLogConsumer(logger))
                    .withReuse(true);
        }
        if (!redisContainer.isRunning()) {
            redisContainer.start();
        }
    }

    public GenericContainer getRedisContainer() {
        return redisContainer;
    }
}
