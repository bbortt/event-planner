package org.springframework.security.config.annotation.web.configuration;

import java.lang.reflect.Field;
import java.util.List;
import org.springframework.aot.beans.factory.BeanDefinitionRegistrar;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.servlet.support.RequestDataValueProcessor;

public final class ContextBootstrapInitializer {
  public static void registerWebSecurityConfiguration(DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration", WebSecurityConfiguration.class)
        .instanceSupplier((instanceContext) -> {
          WebSecurityConfiguration bean = new WebSecurityConfiguration();
          instanceContext.field("objectObjectPostProcessor", ObjectPostProcessor.class)
              .resolve(beanFactory, false).ifResolved((attributes) -> {
                Field objectObjectPostProcessorField = ReflectionUtils.findField(WebSecurityConfiguration.class, "objectObjectPostProcessor", ObjectPostProcessor.class);
                ReflectionUtils.makeAccessible(objectObjectPostProcessorField);
                ReflectionUtils.setField(objectObjectPostProcessorField, bean, attributes.get(0));
              });
                  instanceContext.method("setFilterChainProxySecurityConfigurer", ObjectPostProcessor.class, ConfigurableListableBeanFactory.class)
                      .resolve(beanFactory, false).ifResolved((attributes) -> bean.setFilterChainProxySecurityConfigurer(attributes.get(0), attributes.get(1)));
                  instanceContext.method("setFilterChains", List.class)
                      .resolve(beanFactory, false).ifResolved((attributes) -> bean.setFilterChains(attributes.get(0)));
                  instanceContext.method("setWebSecurityCustomizers", List.class)
                      .resolve(beanFactory, false).ifResolved((attributes) -> bean.setWebSecurityCustomizers(attributes.get(0)));
                  return bean;
                }).register(beanFactory);
          }

          public static void registerWebMvcSecurityConfiguration(
              DefaultListableBeanFactory beanFactory) {
            BeanDefinitionRegistrar.of("org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration", WebMvcSecurityConfiguration.class)
                .instanceSupplier(WebMvcSecurityConfiguration::new).register(beanFactory);
          }

          public static void registerWebMvcSecurityConfiguration_requestDataValueProcessor(
              DefaultListableBeanFactory beanFactory) {
            BeanDefinitionRegistrar.of("requestDataValueProcessor", RequestDataValueProcessor.class).withFactoryMethod(WebMvcSecurityConfiguration.class, "requestDataValueProcessor")
                .instanceSupplier(() -> beanFactory.getBean(WebMvcSecurityConfiguration.class).requestDataValueProcessor()).register(beanFactory);
          }

          public static void registerHttpSecurityConfiguration(
              DefaultListableBeanFactory beanFactory) {
            BeanDefinitionRegistrar.of("org.springframework.security.config.annotation.web.configuration.HttpSecurityConfiguration", HttpSecurityConfiguration.class)
                .instanceSupplier((instanceContext) -> {
                  HttpSecurityConfiguration bean = new HttpSecurityConfiguration();
                  instanceContext.method("setApplicationContext", ApplicationContext.class)
                      .invoke(beanFactory, (attributes) -> bean.setApplicationContext(attributes.get(0)));
                  instanceContext.method("setObjectPostProcessor", ObjectPostProcessor.class)
                      .invoke(beanFactory, (attributes) -> bean.setObjectPostProcessor(attributes.get(0)));
                  instanceContext.method("setAuthenticationConfiguration", AuthenticationConfiguration.class)
                      .invoke(beanFactory, (attributes) -> bean.setAuthenticationConfiguration(attributes.get(0)));
                  return bean;
                }).register(beanFactory);
          }

          public static void registerHttpSecurityConfiguration_httpSecurity(
              DefaultListableBeanFactory beanFactory) {
            BeanDefinitionRegistrar.of("org.springframework.security.config.annotation.web.configuration.HttpSecurityConfiguration.httpSecurity", HttpSecurity.class).withFactoryMethod(HttpSecurityConfiguration.class, "httpSecurity")
                .instanceSupplier(() -> beanFactory.getBean(HttpSecurityConfiguration.class).httpSecurity()).customize((bd) -> bd.setScope("prototype")).register(beanFactory);
          }
        }
