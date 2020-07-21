package io.github.bbortt.event.planner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class ResponsibilityTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Responsibility.class);
        Responsibility responsibility1 = new Responsibility();
        responsibility1.setId(1L);
        Responsibility responsibility2 = new Responsibility();
        responsibility2.setId(responsibility1.getId());
        assertThat(responsibility1).isEqualTo(responsibility2);
        responsibility2.setId(2L);
        assertThat(responsibility1).isNotEqualTo(responsibility2);
        responsibility1.setId(null);
        assertThat(responsibility1).isNotEqualTo(responsibility2);
    }
}
