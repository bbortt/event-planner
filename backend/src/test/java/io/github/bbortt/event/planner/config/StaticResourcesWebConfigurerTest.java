package io.github.bbortt.event.planner.config;

import static io.github.bbortt.event.planner.config.StaticResourcesWebConfiguration.RESOURCE_LOCATIONS;
import static io.github.bbortt.event.planner.config.StaticResourcesWebConfiguration.RESOURCE_PATHS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockServletContext;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

class StaticResourcesWebConfigurerTest {
    StaticResourcesWebConfiguration staticResourcesWebConfiguration;
    private ResourceHandlerRegistry resourceHandlerRegistry;
    private MockServletContext servletContext;
    private WebApplicationContext applicationContext;

    @BeforeEach
    void setUp() {
        servletContext = spy(new MockServletContext());
        applicationContext = mock(WebApplicationContext.class);
        resourceHandlerRegistry = spy(new ResourceHandlerRegistry(applicationContext, servletContext));
        staticResourcesWebConfiguration = spy(new StaticResourcesWebConfiguration());
    }

    @Test
    void shouldAppendResourceHandlerAndInitializeIt() {
        staticResourcesWebConfiguration.addResourceHandlers(resourceHandlerRegistry);

        verify(resourceHandlerRegistry, times(1)).addResourceHandler(RESOURCE_PATHS);
        verify(staticResourcesWebConfiguration, times(1)).initializeResourceHandler(any(ResourceHandlerRegistration.class));
        for (String testingPath : RESOURCE_PATHS) {
            assertThat(resourceHandlerRegistry.hasMappingForPattern(testingPath)).isTrue();
        }
    }

    @Test
    void shouldInitializeResourceHandlerWithLocations() {
        ResourceHandlerRegistration resourceHandlerRegistration = spy(new ResourceHandlerRegistration(RESOURCE_PATHS));

        staticResourcesWebConfiguration.initializeResourceHandler(resourceHandlerRegistration);

        verify(resourceHandlerRegistration, times(1)).addResourceLocations(RESOURCE_LOCATIONS);
    }
}
