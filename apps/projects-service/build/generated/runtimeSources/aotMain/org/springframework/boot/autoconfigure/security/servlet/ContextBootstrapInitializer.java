package org.springframework.boot.autoconfigure.security.servlet;

import org.springframework.aot.beans.factory.BeanDefinitionRegistrar;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.filter.ErrorPageSecurityFilter;
import org.springframework.context.ApplicationContext;
import org.springframework.core.ResolvableType;

public final class ContextBootstrapInitializer {
  public static void registerSpringBootWebSecurityConfiguration_ErrorPageSecurityFilterConfiguration(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("org.springframework.boot.autoconfigure.security.servlet.SpringBootWebSecurityConfiguration$ErrorPageSecurityFilterConfiguration", SpringBootWebSecurityConfiguration.ErrorPageSecurityFilterConfiguration.class)
        .instanceSupplier(SpringBootWebSecurityConfiguration.ErrorPageSecurityFilterConfiguration::new).register(beanFactory);
  }

  public static void registerErrorPageSecurityFilterConfiguration_errorPageSecurityFilter(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("errorPageSecurityFilter", ResolvableType.forClassWithGenerics(FilterRegistrationBean.class, ErrorPageSecurityFilter.class)).withFactoryMethod(SpringBootWebSecurityConfiguration.ErrorPageSecurityFilterConfiguration.class, "errorPageSecurityFilter", ApplicationContext.class)
        .instanceSupplier((instanceContext) -> instanceContext.create(beanFactory, (attributes) -> beanFactory.getBean(SpringBootWebSecurityConfiguration.ErrorPageSecurityFilterConfiguration.class).errorPageSecurityFilter(attributes.get(0)))).register(beanFactory);
  }

  public static void registerSpringBootWebSecurityConfiguration(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("org.springframework.boot.autoconfigure.security.servlet.SpringBootWebSecurityConfiguration", SpringBootWebSecurityConfiguration.class)
        .instanceSupplier(SpringBootWebSecurityConfiguration::new).register(beanFactory);
  }
}
