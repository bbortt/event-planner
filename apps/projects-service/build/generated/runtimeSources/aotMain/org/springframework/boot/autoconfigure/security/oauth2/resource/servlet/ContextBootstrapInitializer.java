package org.springframework.boot.autoconfigure.security.oauth2.resource.servlet;

import org.springframework.aot.beans.factory.BeanDefinitionRegistrar;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;

public final class ContextBootstrapInitializer {
  public static void registerOauth2ResourceServerConfiguration_JwtConfiguration(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.Oauth2ResourceServerConfiguration$JwtConfiguration", Oauth2ResourceServerConfiguration.JwtConfiguration.class)
        .instanceSupplier(Oauth2ResourceServerConfiguration.JwtConfiguration::new).register(beanFactory);
  }

  public static void registerOAuth2ResourceServerOpaqueTokenConfiguration_OpaqueTokenIntrospectionClientConfiguration(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerOpaqueTokenConfiguration$OpaqueTokenIntrospectionClientConfiguration", OAuth2ResourceServerOpaqueTokenConfiguration.OpaqueTokenIntrospectionClientConfiguration.class)
        .instanceSupplier(OAuth2ResourceServerOpaqueTokenConfiguration.OpaqueTokenIntrospectionClientConfiguration::new).register(beanFactory);
  }

  public static void registerOauth2ResourceServerConfiguration_OpaqueTokenConfiguration(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.Oauth2ResourceServerConfiguration$OpaqueTokenConfiguration", Oauth2ResourceServerConfiguration.OpaqueTokenConfiguration.class)
        .instanceSupplier(Oauth2ResourceServerConfiguration.OpaqueTokenConfiguration::new).register(beanFactory);
  }
}
