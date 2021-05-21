package io.github.bbortt.event.planner.backend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Event.class);
        Event event1 = new Event();
        event1.id(1L);
        Event event2 = new Event();
        event2.id(event1.getId());
        assertThat(event1).isEqualTo(event2);
        event2.id(2L);
        assertThat(event1).isNotEqualTo(event2);
        event1.id(null);
        assertThat(event1).isNotEqualTo(event2);
    }
}
