package io.github.bbortt.event.planner.config;

import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.boot.web.server.ErrorPageRegistry;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class StaticErrorPageConfig implements ErrorPageRegistrar {

  @Override
  public void registerErrorPages(ErrorPageRegistry errorPageRegistry) {
    errorPageRegistry.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/index.html"));
  }
}
