package io.github.bbortt.event.planner.web.api.mapper;

import static java.util.Optional.ofNullable;

import java.util.Optional;

public interface MapperWithOptionals {
    default Optional<Boolean> map(Boolean value) {
        return ofNullable(value);
    }

    default Optional<Long> map(Long value) {
        return ofNullable(value);
    }

    default Optional<String> map(String value) {
        return ofNullable(value);
    }
}
