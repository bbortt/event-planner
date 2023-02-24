package org.springframework.security.config.annotation.authentication.configuration;

import org.springframework.aot.beans.factory.BeanDefinitionRegistrar;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;

public final class ContextBootstrapInitializer {
  public static void registerAuthenticationConfiguration_initializeUserDetailsBeanManagerConfigurer(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("initializeUserDetailsBeanManagerConfigurer", InitializeUserDetailsBeanManagerConfigurer.class).withFactoryMethod(AuthenticationConfiguration.class, "initializeUserDetailsBeanManagerConfigurer", ApplicationContext.class)
        .instanceSupplier((instanceContext) -> instanceContext.create(beanFactory, (attributes) -> AuthenticationConfiguration.initializeUserDetailsBeanManagerConfigurer(attributes.get(0)))).register(beanFactory);
  }

  public static void registerAuthenticationConfiguration_initializeAuthenticationProviderBeanManagerConfigurer(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("initializeAuthenticationProviderBeanManagerConfigurer", InitializeAuthenticationProviderBeanManagerConfigurer.class).withFactoryMethod(AuthenticationConfiguration.class, "initializeAuthenticationProviderBeanManagerConfigurer", ApplicationContext.class)
        .instanceSupplier((instanceContext) -> instanceContext.create(beanFactory, (attributes) -> AuthenticationConfiguration.initializeAuthenticationProviderBeanManagerConfigurer(attributes.get(0)))).register(beanFactory);
  }
}
