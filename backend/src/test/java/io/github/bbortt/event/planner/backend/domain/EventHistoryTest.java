package io.github.bbortt.event.planner.backend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EventHistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventHistory.class);
        EventHistory eventHistory1 = new EventHistory();
        eventHistory1.id(1L);
        EventHistory eventHistory2 = new EventHistory();
        eventHistory2.id(eventHistory1.getId());
        assertThat(eventHistory1).isEqualTo(eventHistory2);
        eventHistory2.id(2L);
        assertThat(eventHistory1).isNotEqualTo(eventHistory2);
        eventHistory1.id(null);
        assertThat(eventHistory1).isNotEqualTo(eventHistory2);
    }
}
