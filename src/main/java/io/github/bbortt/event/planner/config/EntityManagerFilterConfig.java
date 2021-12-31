package io.github.bbortt.event.planner.config;

import javax.servlet.Filter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;

@Configuration
public class EntityManagerFilterConfig {

  @Bean
  public Filter graphqlOpenFilterFilter() {
    return new OpenEntityManagerInViewFilter();
  }
}
