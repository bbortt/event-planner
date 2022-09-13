package io.github.bbortt.event.planner.api.v1;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

  @GetMapping("/rest/test")
  public Page getPaginated() {
    return Page.empty();
  }
}
