package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;
import org.springframework.transaction.annotation.Transactional;

@Sql({ "classpath:db/scripts/InvitationServiceIT_before.sql" })
@Sql(value = { "classpath:db/scripts/InvitationServiceIT_after.sql" }, executionPhase = ExecutionPhase.AFTER_TEST_METHOD)
public class InvitationServiceIT extends AbstractApplicationContextAwareIT {

    @Autowired
    InvitationRepository invitationRepository;

    @Autowired
    InvitationService invitationService;

    @Test
    @Transactional
    public void invitationNotAcceptedElderThan14DaysDeleted() {
        int sizeBeforeDeletion = invitationRepository.findAll().size();

        invitationService.removeNotAcceptedInvitations();

        Assertions.assertThat(invitationRepository.findAll().size()).isEqualTo(sizeBeforeDeletion - 1);
    }
}
