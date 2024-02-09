package io.github.bbortt.event.planner.web.api.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MapperWithOptionalsTest {

    private MapperWithOptionalsImpl fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new MapperWithOptionalsImpl();
    }

    @Test
    void mapBoolean() {
        assertTrue(fixture.map(true).orElseThrow());
        assertFalse(fixture.map(false).orElseThrow());
        assertTrue(fixture.map((Boolean) null).isEmpty());
    }

    @Test
    void mapLong() {
        var longValue = 1234L;
        assertEquals(longValue, fixture.map(longValue).orElseThrow());
        assertTrue(fixture.map((Long) null).isEmpty());
    }

    @Test
    void mapString() {
        var stringValue = "string";
        assertEquals(stringValue, fixture.map(stringValue).orElseThrow());
        assertTrue(fixture.map((String) null).isEmpty());
    }

    static class MapperWithOptionalsImpl implements MapperWithOptionals {}
}
