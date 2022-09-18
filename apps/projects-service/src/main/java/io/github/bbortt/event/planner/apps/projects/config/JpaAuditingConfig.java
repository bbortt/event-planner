package io.github.bbortt.event.planner.apps.projects.config;

import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "customAuditor")
public class JpaAuditingConfig {

  @Bean
  @Lazy
  public AuditorAware<String> customAuditor() {
    return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication()).map(Authentication::getName);
  }
}
