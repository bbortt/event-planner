package io.github.bbortt.event.planner.backend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Project.class);
        Project project1 = new Project();
        project1.id(1L);
        Project project2 = new Project();
        project2.id(project1.getId());
        assertThat(project1).isEqualTo(project2);
        project2.id(2L);
        assertThat(project1).isNotEqualTo(project2);
        project1.id(null);
        assertThat(project1).isNotEqualTo(project2);
    }
}
