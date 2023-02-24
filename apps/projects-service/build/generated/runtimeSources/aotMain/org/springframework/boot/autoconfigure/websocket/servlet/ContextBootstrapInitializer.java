package org.springframework.boot.autoconfigure.websocket.servlet;

import org.springframework.aot.beans.factory.BeanDefinitionRegistrar;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;

public final class ContextBootstrapInitializer {
  public static void registerWebSocketServletAutoConfiguration_UndertowWebSocketConfiguration(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration$UndertowWebSocketConfiguration", WebSocketServletAutoConfiguration.UndertowWebSocketConfiguration.class)
        .instanceSupplier(WebSocketServletAutoConfiguration.UndertowWebSocketConfiguration::new).register(beanFactory);
  }

  public static void registerUndertowWebSocketConfiguration_websocketServletWebServerCustomizer(
      DefaultListableBeanFactory beanFactory) {
    BeanDefinitionRegistrar.of("websocketServletWebServerCustomizer", UndertowWebSocketServletWebServerCustomizer.class).withFactoryMethod(WebSocketServletAutoConfiguration.UndertowWebSocketConfiguration.class, "websocketServletWebServerCustomizer")
        .instanceSupplier(() -> beanFactory.getBean(WebSocketServletAutoConfiguration.UndertowWebSocketConfiguration.class).websocketServletWebServerCustomizer()).register(beanFactory);
  }
}
