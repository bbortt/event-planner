package io.github.bbortt.event.planner.config;

import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Override
  public void configure(HttpSecurity http) throws Exception {
    // prettier-ignore-start
    http
      .authorizeRequests()
        .antMatchers("/api/graphql/v1").hasAuthority("SCOPE_graphql:access")
        .antMatchers("/api/rest/v1/user").hasAuthority("SCOPE_user:synchronize")
      .and()
        .cors()
      .and()
        .oauth2ResourceServer()
        .jwt();
    // prettier-ignore-end
  }
}
