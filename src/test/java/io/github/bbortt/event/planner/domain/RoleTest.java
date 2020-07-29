package io.github.bbortt.event.planner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class RoleTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Role.class);
        Role role1 = new Role();
        role1.setName("A");
        Role role2 = new Role();
        role2.setName(role1.getName());
        assertThat(role1).isEqualTo(role2);
        role2.setName("B");
        assertThat(role1).isNotEqualTo(role2);
        role1.setName(null);
        assertThat(role1).isNotEqualTo(role2);
    }
}
