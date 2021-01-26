package io.github.bbortt.event.planner.service;

import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.domain.Responsibility;
import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.UserRepository;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

public class InvitationServiceUnitTest {

    @Rule
    MockitoRule mockitoRule = MockitoJUnit.rule();

    @Mock
    ProjectService projectServiceMock;

    @Mock
    InvitationRepository invitationRepositoryMock;

    @Mock
    UserRepository userRepositoryMock;

    InvitationService fixture;

    @Before
    public void beforeTestSetup() {
        fixture = new InvitationService(projectServiceMock, invitationRepositoryMock, userRepositoryMock);
    }

    @Test
    void isNameExistingInProject() {
        final Long locationId = 1234L;
        final String email = "existing@email";

        doReturn(Optional.of(new Responsibility())).when(invitationRepositoryMock).findOneByEmailAndProjectId(email, locationId);

        Assertions.assertThat(fixture.isEmailExistingInProject(locationId, email)).isTrue();

        doReturn(Optional.empty()).when(invitationRepositoryMock).findOneByEmailAndProjectId(email, locationId);

        Assertions.assertThat(fixture.isEmailExistingInProject(locationId, email)).isFalse();
    }
}
