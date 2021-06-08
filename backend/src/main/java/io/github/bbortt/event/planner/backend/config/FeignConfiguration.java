package io.github.bbortt.event.planner.backend.config;

import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.FeignClientsConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@EnableHystrix
@Import(FeignClientsConfiguration.class)
@EnableFeignClients(basePackages = "io.github.bbortt.event.planner.backend")
public class FeignConfiguration {

    /**
     * Set the Feign specific log level to log client REST requests.
     */
    @Bean
    feign.Logger.Level feignLoggerLevel() {
        return feign.Logger.Level.BASIC;
    }
}
