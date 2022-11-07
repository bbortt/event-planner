package io.github.bbortt.event.planner.apps.projects.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("io.github.bbortt.event.planner.apps.projects")
public class ProjectsServiceProperties {

  private Services services;

  public Services getServices() {
    return services;
  }

  public void setServices(Services services) {
    this.services = services;
  }

  public static class Services {

    private Permission permission;

    public Permission getPermission() {
      return permission;
    }

    public void setPermission(Permission permission) {
      this.permission = permission;
    }

    public static class Permission {

      private String url;

      public String getUrl() {
        return url;
      }

      public void setUrl(String url) {
        this.url = url;
      }
    }
  }
}
