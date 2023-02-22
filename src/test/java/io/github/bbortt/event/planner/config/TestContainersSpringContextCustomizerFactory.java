package io.github.bbortt.event.planner.config;

import java.util.Arrays;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.support.DefaultSingletonBeanRegistry;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.test.context.ContextConfigurationAttributes;
import org.springframework.test.context.ContextCustomizer;
import org.springframework.test.context.ContextCustomizerFactory;
import tech.jhipster.config.JHipsterConstants;

public class TestContainersSpringContextCustomizerFactory implements ContextCustomizerFactory {

    private Logger log = LoggerFactory.getLogger(TestContainersSpringContextCustomizerFactory.class);

    private static RedisTestContainer redisBean;
    private static SqlTestContainer devTestContainer;
    private static SqlTestContainer prodTestContainer;

    @Override
    public ContextCustomizer createContextCustomizer(Class<?> testClass, List<ContextConfigurationAttributes> configAttributes) {
        return (context, mergedConfig) -> {
            ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
            TestPropertyValues testValues = TestPropertyValues.empty();
            EmbeddedRedis redisAnnotation = AnnotatedElementUtils.findMergedAnnotation(testClass, EmbeddedRedis.class);
            if (null != redisAnnotation) {
                log.debug("detected the EmbeddedRedis annotation on class {}", testClass.getName());
                log.info("Warming up the redis database");
                if (null == redisBean) {
                    redisBean = beanFactory.createBean(RedisTestContainer.class);
                    beanFactory.registerSingleton(RedisTestContainer.class.getName(), redisBean);
                    // ((DefaultListableBeanFactory)beanFactory).registerDisposableBean(RedisTestContainer.class.getName(), redisBean);
                }
                testValues =
                    testValues.and(
                        "jhipster.cache.redis.server=redis://" +
                        redisBean.getRedisContainer().getContainerIpAddress() +
                        ":" +
                        redisBean.getRedisContainer().getMappedPort(6379)
                    );
            }
            EmbeddedSQL sqlAnnotation = AnnotatedElementUtils.findMergedAnnotation(testClass, EmbeddedSQL.class);
            if (null != sqlAnnotation) {
                log.debug("detected the EmbeddedSQL annotation on class {}", testClass.getName());
                log.info("Warming up the sql database");
                if (
                    Arrays
                        .asList(context.getEnvironment().getActiveProfiles())
                        .contains("test" + JHipsterConstants.SPRING_PROFILE_DEVELOPMENT)
                ) {
                    if (null == devTestContainer) {
                        try {
                            Class<? extends SqlTestContainer> containerClass = (Class<? extends SqlTestContainer>) Class.forName(
                                this.getClass().getPackageName() + ".PostgreSqlTestContainer"
                            );
                            devTestContainer = beanFactory.createBean(containerClass);
                            beanFactory.registerSingleton(containerClass.getName(), devTestContainer);
                            // ((DefaultListableBeanFactory)beanFactory).registerDisposableBean(containerClass.getName(), devTestContainer);
                        } catch (ClassNotFoundException e) {
                            throw new RuntimeException(e);
                        }
                    }
                    testValues = testValues.and("spring.datasource.url=" + devTestContainer.getTestContainer().getJdbcUrl() + "");
                    testValues = testValues.and("spring.datasource.username=" + devTestContainer.getTestContainer().getUsername());
                    testValues = testValues.and("spring.datasource.password=" + devTestContainer.getTestContainer().getPassword());
                }
                if (
                    Arrays
                        .asList(context.getEnvironment().getActiveProfiles())
                        .contains("test" + JHipsterConstants.SPRING_PROFILE_PRODUCTION)
                ) {
                    if (null == prodTestContainer) {
                        try {
                            Class<? extends SqlTestContainer> containerClass = (Class<? extends SqlTestContainer>) Class.forName(
                                this.getClass().getPackageName() + ".PostgreSqlTestContainer"
                            );
                            prodTestContainer = beanFactory.createBean(containerClass);
                            beanFactory.registerSingleton(containerClass.getName(), prodTestContainer);
                            // ((DefaultListableBeanFactory)beanFactory).registerDisposableBean(containerClass.getName(), prodTestContainer);
                        } catch (ClassNotFoundException e) {
                            throw new RuntimeException(e);
                        }
                    }
                    testValues = testValues.and("spring.datasource.url=" + prodTestContainer.getTestContainer().getJdbcUrl() + "");
                    testValues = testValues.and("spring.datasource.username=" + prodTestContainer.getTestContainer().getUsername());
                    testValues = testValues.and("spring.datasource.password=" + prodTestContainer.getTestContainer().getPassword());
                }
            }
            testValues.applyTo(context);
        };
    }
}
