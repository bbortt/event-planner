package io.github.bbortt.event.planner.apps.projects.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  private final boolean csrfEnabled;

  public SecurityConfig(@Value("${spring.security.csrf.enabled:true}") boolean csrfEnabled) {
    this.csrfEnabled = csrfEnabled;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    if (!csrfEnabled) {
      http.csrf().disable();
    }

    // prettier-ignore-start
        http
                .authorizeRequests()
                .antMatchers("/api/rest/v1/*").hasAuthority("SCOPE_restapi:access")
                .and()
                .cors()
                .and()
                .oauth2ResourceServer()
                .jwt();

    return http.build();
  }
}
