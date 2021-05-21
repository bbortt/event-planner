package io.github.bbortt.event.planner.backend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LocationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Location.class);
        Location location1 = new Location();
        location1.id(1L);
        Location location2 = new Location();
        location2.id(location1.getId());
        assertThat(location1).isEqualTo(location2);
        location2.id(2L);
        assertThat(location1).isNotEqualTo(location2);
        location1.id(null);
        assertThat(location1).isNotEqualTo(location2);
    }
}
