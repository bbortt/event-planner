package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.web.rest.InvitationResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import io.github.bbortt.event.planner.web.rest.UserResourceIT;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import javax.persistence.EntityManager;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

class InvitationServiceIT extends AbstractApplicationContextAwareIT {

    static final String USER_LOGIN = "invitationserviceit-user";

    @Autowired
    InvitationRepository invitationRepository;

    @Autowired
    InvitationService invitationService;

    @Autowired
    EntityManager entityManager;

    @BeforeEach
    void initTest() {
        User user1 = UserResourceIT.createEntity(entityManager);
        user1.setId(USER_LOGIN);
        user1.setLogin(USER_LOGIN);
        user1.setEmail(USER_LOGIN + "@localhost");
        entityManager.persist(user1);

        Project project1 = ProjectResourceIT.createEntity(entityManager);
        project1.setName("InvitationServiceIT-project-1");
        entityManager.persist(project1);
        Project project2 = ProjectResourceIT.createEntity(entityManager);
        project2.setName("InvitationServiceIT-project-2");
        entityManager.persist(project2);

        Invitation invitation1 = InvitationResourceIT.createEntity(entityManager);
        invitation1.setUser(user1);
        invitation1.setEmail("email-invitation-1@localhost");
        invitation1.setProject(project1);
        entityManager.persist(invitation1);
        Invitation invitation2 = InvitationResourceIT.createEntity(entityManager);
        invitation2.setUser(user1);
        invitation2.setEmail("email-invitation-2@localhost");
        invitation2.setProject(project2);
        invitation2.setCreatedDate(Instant.now().minus(15, ChronoUnit.DAYS));
        entityManager.persist(invitation2);
    }

    @Test
    @Transactional
    void invitationNotAcceptedElderThan14DaysDeleted() {
        int sizeBeforeDeletion = invitationRepository.findAll().size();

        invitationService.removeNotAcceptedInvitations();

        Assertions.assertThat(invitationRepository.findAll().size()).isEqualTo(sizeBeforeDeletion - 1);
    }
}
