package io.github.bbortt.event.planner.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LocationMapperTest {

    private LocationMapper locationMapper;

    @BeforeEach
    public void setUp() {
        locationMapper = new LocationMapperImpl();
    }
}
