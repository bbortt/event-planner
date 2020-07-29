package io.github.bbortt.event.planner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class RoleTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Role.class);
        Role role1 = new Role();
        role1.setId(1L);
        Role role2 = new Role();
        role2.setId(role1.getId());
        assertThat(role1).isEqualTo(role2);
        role2.setId(2L);
        assertThat(role1).isNotEqualTo(role2);
        role1.setId(null);
        assertThat(role1).isNotEqualTo(role2);
    }
}
