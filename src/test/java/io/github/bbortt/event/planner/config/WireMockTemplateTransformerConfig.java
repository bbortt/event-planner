package io.github.bbortt.event.planner.config;

import com.github.tomakehurst.wiremock.extension.responsetemplating.ResponseTemplateTransformer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WireMockTemplateTransformerConfig {

  @Bean
  public ResponseTemplateTransformer responseTemplateTransformer() {
    return new ResponseTemplateTransformer(true);
  }
}
