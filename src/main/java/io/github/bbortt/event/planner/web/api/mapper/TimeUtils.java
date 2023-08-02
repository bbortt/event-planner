package io.github.bbortt.event.planner.web.api.mapper;

import jakarta.annotation.Nullable;
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

    @Nullable
    OffsetDateTime toOffsetDateTime(@Nullable Instant instant) {
        if (instant == null) {
            return null;
        }

        return OffsetDateTime.ofInstant(instant, zoneIdProvider.getZoneId());
    }

    @Nullable
    LocalDate toLocalDate(@Nullable Instant instant) {
        if (instant == null) {
            return null;
        }

        return LocalDate.ofInstant(instant, zoneIdProvider.getZoneId());
    }

    static interface ZoneIdProvider {
        ZoneId getZoneId();
    }
}
