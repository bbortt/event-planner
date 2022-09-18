package io.github.bbortt.event.planner.apps.projects.rest.v1;

import io.github.bbortt.event.planner.apps.projects.v1.rest.ProjectApi;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/api")
public class ProjectApiController implements ProjectApi {}
