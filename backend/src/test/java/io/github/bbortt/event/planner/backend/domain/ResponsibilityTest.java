package io.github.bbortt.event.planner.backend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ResponsibilityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Responsibility.class);
        Responsibility responsibility1 = new Responsibility();
        responsibility1.id(1L);
        Responsibility responsibility2 = new Responsibility();
        responsibility2.id(responsibility1.getId());
        assertThat(responsibility1).isEqualTo(responsibility2);
        responsibility2.id(2L);
        assertThat(responsibility1).isNotEqualTo(responsibility2);
        responsibility1.id(null);
        assertThat(responsibility1).isNotEqualTo(responsibility2);
    }
}
