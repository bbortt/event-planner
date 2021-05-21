package io.github.bbortt.event.planner.backend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SectionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Section.class);
        Section section1 = new Section();
        section1.id(1L);
        Section section2 = new Section();
        section2.id(section1.getId());
        assertThat(section1).isEqualTo(section2);
        section2.id(2L);
        assertThat(section1).isNotEqualTo(section2);
        section1.id(null);
        assertThat(section1).isNotEqualTo(section2);
    }
}
