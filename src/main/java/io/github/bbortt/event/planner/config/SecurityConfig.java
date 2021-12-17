package io.github.bbortt.event.planner.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private final boolean csrfEnabled;

  public SecurityConfig(@Value("${spring.security.csrf.enabled:true}") boolean csrfEnabled) {
    this.csrfEnabled = csrfEnabled;
  }

  @Override
  public void configure(HttpSecurity http) throws Exception {
    if (!csrfEnabled) {
      http.csrf().disable();
    }

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
