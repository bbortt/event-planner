package io.github.bbortt.event.planner.backend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InvitationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Invitation.class);
        Invitation invitation1 = new Invitation();
        invitation1.id(1L);
        Invitation invitation2 = new Invitation();
        invitation2.id(invitation1.getId());
        assertThat(invitation1).isEqualTo(invitation2);
        invitation2.id(2L);
        assertThat(invitation1).isNotEqualTo(invitation2);
        invitation1.id(null);
        assertThat(invitation1).isNotEqualTo(invitation2);
    }
}
