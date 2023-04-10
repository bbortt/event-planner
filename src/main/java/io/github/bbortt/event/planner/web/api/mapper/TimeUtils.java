package io.github.bbortt.event.planner.web.api.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;

class TimeUtils {

    private ZoneIdProvider zoneIdProvider;

    TimeUtils() {
        this.zoneIdProvider = ZoneId::systemDefault;
    }

    TimeUtils zoneIdProvider(ZoneIdProvider zoneIdProvider) {
        this.zoneIdProvider = zoneIdProvider;
        return this;
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
