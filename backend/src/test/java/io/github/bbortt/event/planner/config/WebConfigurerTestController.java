package io.github.bbortt.event.planner.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class WebConfigurerTestController {

    @GetMapping("/api/test-cors")
    void testCorsOnApiPath() {}

    @GetMapping("/test/test-cors")
    void testCorsOnOtherPath() {}
}
