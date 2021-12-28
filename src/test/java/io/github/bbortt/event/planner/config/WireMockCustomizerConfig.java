package io.github.bbortt.event.planner.config;

import com.github.tomakehurst.wiremock.extension.responsetemplating.ResponseTemplateTransformer;
import java.util.Objects;
import java.util.regex.Matcher;
import org.springframework.cloud.contract.wiremock.WireMockConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WireMockCustomizerConfig {

  @Bean
  WireMockConfigurationCustomizer optionsCustomizer() {
    return options -> options.extensions(new ResponseTemplateTransformer(true));
  }
}
