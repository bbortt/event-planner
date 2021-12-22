package io.github.bbortt.event.planner.config;

import io.github.bbortt.event.planner.api.v1.converter.V1UserDtoToAuth0UserConverter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addFormatters(FormatterRegistry registry) {
    registry.addConverter(new V1UserDtoToAuth0UserConverter());
  }
}
