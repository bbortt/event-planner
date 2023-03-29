package io.github.bbortt.event.planner.web.api.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;

class TimeUtils {

    private final ZoneIdProvider zoneIdProvider;

    TimeUtils(ZoneIdProvider zoneIdProvider) {
        this.zoneIdProvider = zoneIdProvider;
    }

    OffsetDateTime toOffsetDateTime(Instant instant) {
        return OffsetDateTime.ofInstant(instant, zoneIdProvider.getZoneId());
    }

    LocalDate toLocalDate(Instant instant) {
        return LocalDate.ofInstant(instant, zoneIdProvider.getZoneId());
    }

    static interface ZoneIdProvider {
        ZoneId getZoneId();
    }
}
