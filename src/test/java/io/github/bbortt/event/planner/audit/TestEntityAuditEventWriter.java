package io.github.bbortt.event.planner.audit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestEntityAuditEventWriter {

    @Bean
    EntityAuditEventWriter entityAuditEventWriter() {
        return (target, action) -> {};
    }
}
