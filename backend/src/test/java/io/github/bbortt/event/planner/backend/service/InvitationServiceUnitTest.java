package io.github.bbortt.event.planner.backend.service;

import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.repository.InvitationRepository;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class InvitationServiceUnitTest {

    @Mock
    ProjectService projectServiceMock;

    @Mock
    InvitationRepository invitationRepositoryMock;

    @Mock
    UserRepository userRepositoryMock;

    InvitationService fixture;

    @BeforeEach
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
