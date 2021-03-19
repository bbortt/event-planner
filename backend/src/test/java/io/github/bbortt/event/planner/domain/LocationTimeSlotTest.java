package io.github.bbortt.event.planner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LocationTimeSlotTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LocationTimeSlot.class);
        LocationTimeSlot locationTimeSlot1 = new LocationTimeSlot();
        locationTimeSlot1.setId(1L);
        LocationTimeSlot locationTimeSlot2 = new LocationTimeSlot();
        locationTimeSlot2.setId(locationTimeSlot1.getId());
        assertThat(locationTimeSlot1).isEqualTo(locationTimeSlot2);
        locationTimeSlot2.setId(2L);
        assertThat(locationTimeSlot1).isNotEqualTo(locationTimeSlot2);
        locationTimeSlot1.setId(null);
        assertThat(locationTimeSlot1).isNotEqualTo(locationTimeSlot2);
    }
}
