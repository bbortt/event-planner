package io.github.bbortt.event.planner.apps.projects.config;

import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.MemberApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.PermissionApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.ProjectApi;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.fallback.MemberApiFallback;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.fallback.PermissionApiFallback;
import io.github.bbortt.event.planner.apps.projects.system.model.rest.v1.fallback.ProjectApiFallback;
import io.github.resilience4j.feign.FeignDecorators;
import io.github.resilience4j.feign.Resilience4jFeign;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiClientConfig {

  private final ProjectsServiceProperties projectsServiceProperties;

  public ApiClientConfig(ProjectsServiceProperties projectsServiceProperties) {
    this.projectsServiceProperties = projectsServiceProperties;
  }

  @Bean
  public MemberApi memberApi() {
    FeignDecorators decorators = FeignDecorators.builder().withFallbackFactory(MemberApiFallback::new).build();
    return Resilience4jFeign.builder(decorators).target(MemberApi.class, projectsServiceProperties.getServices().getPermission().getUrl());
  }

  @Bean
  public PermissionApi permissionApi() {
    FeignDecorators decorators = FeignDecorators.builder().withFallbackFactory(PermissionApiFallback::new).build();
    return Resilience4jFeign
      .builder(decorators)
      .target(PermissionApi.class, projectsServiceProperties.getServices().getPermission().getUrl());
  }

  @Bean
  public ProjectApi projectApi() {
    FeignDecorators decorators = FeignDecorators.builder().withFallbackFactory(ProjectApiFallback::new).build();
    return Resilience4jFeign.builder(decorators).target(ProjectApi.class, projectsServiceProperties.getServices().getPermission().getUrl());
  }
}
