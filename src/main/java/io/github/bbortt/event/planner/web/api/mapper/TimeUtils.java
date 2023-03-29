package io.github.bbortt.event.planner.web.api.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;

class TimeUtils {

    private TimeUtils() {
        // Static utility class
    }

    public static OffsetDateTime toOffsetDateTime(Instant instant) {
        return OffsetDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    public static LocalDate toLocalDate(Instant instant) {
        return LocalDate.ofInstant(instant, ZoneId.systemDefault());
    }
}
