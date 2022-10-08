package io.github.bbortt.event.planner.apps.projects;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(proxyBeanMethods = false)
public class ProjectsServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(ProjectsServiceApplication.class, args);
  }
}
