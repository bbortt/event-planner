package io.github.bbortt.event.planner.web.api.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TimeUtilsTest {

    private TimeUtils fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new TimeUtils().zoneIdProvider(() -> ZoneId.of("UTC"));
    }

    @Test
    void toOffsetDateTimeReturnsNonNullOffsetDateTime() {
        Instant instant = Instant.now();
        OffsetDateTime result = fixture.toOffsetDateTime(instant);
        assertNotNull(result, "OffsetDateTime should not be null");
    }

    @Test
    void toOffsetDateTimeReturnsNullOffsetDateTime() {
        OffsetDateTime result = fixture.toOffsetDateTime(null);
        assertNull(result, "OffsetDateTime should be null");
    }

    @Test
    void toOffsetDateTimeReturnsCorrectOffsetDateTime() {
        OffsetDateTime expected = OffsetDateTime.of(2021, 3, 29, 13, 22, 3, 0, ZoneOffset.UTC);
        Instant instant = expected.toInstant();
        OffsetDateTime result = fixture.toOffsetDateTime(instant);
        assertEquals(expected, result, "OffsetDateTime should be " + expected);
    }

    @Test
    void toLocalDateReturnsNonNullLocalDate() {
        Instant instant = Instant.now();
        LocalDate result = fixture.toLocalDate(instant);
        assertNotNull(result, "LocalDate should not be null");
    }

    @Test
    void toLocalDateReturnsNullLocalDate() {
        LocalDate result = fixture.toLocalDate(null);
        assertNull(result, "LocalDate should be null");
    }

    @Test
    void toLocalDateReturnsCorrectLocalDate() {
        Instant instant = Instant.parse("2021-03-29T11:22:03.00Z");
        LocalDate expected = LocalDate.of(2021, 3, 29);
        LocalDate result = fixture.toLocalDate(instant);
        assertEquals(expected, result, "LocalDate should be " + expected);
    }
}
