package io.github.bbortt.event.planner.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.backend.repository.InvitationRepository;
import io.github.bbortt.event.planner.backend.repository.ProjectRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.repository.UserRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.dto.CreateProjectDTO;
import io.github.bbortt.event.planner.backend.service.exception.ForbiddenRequestException;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListeners;
import org.zalando.problem.Status;
import org.zalando.problem.violations.ConstraintViolationProblem;

@ExtendWith(MockitoExtension.class)
@TestExecutionListeners({ WithSecurityContextTestExecutionListener.class })
class ProjectServiceUnitTest {

    static final String MOCK_USER_LOGIN = "mock-user-login";

    @Mock
    Authentication authenticationMock;

    @Mock
    RoleService roleServiceMock;

    @Mock
    UserRepository userRepositoryMock;

    @Mock
    RoleRepository roleRepositoryMock;

    @Mock
    ProjectRepository projectRepositoryMock;

    @Mock
    InvitationRepository invitationRepositoryMock;

    ProjectService fixture;

    @BeforeEach
    void beforeTestSetup() {
        TestSecurityContextHolder.setAuthentication(authenticationMock);

        fixture =
            new ProjectService(roleServiceMock, userRepositoryMock, roleRepositoryMock, projectRepositoryMock, invitationRepositoryMock);
    }

    @Test
    void findMineOrAllByArchivedDoesLoadMine() {
        doReturn(MOCK_USER_LOGIN).when(authenticationMock).getPrincipal();

        Pageable pageable = Pageable.unpaged();

        fixture.findMineOrAllByArchived(false, false, pageable);
        verify(projectRepositoryMock).findMineByArchived(MOCK_USER_LOGIN, false, pageable);

        fixture.findMineOrAllByArchived(false, true, pageable);
        verify(projectRepositoryMock).findMineByArchived(MOCK_USER_LOGIN, true, pageable);
    }

    @Test
    void findMineOrAllByArchivedThrowsExceptionIfAuthorityAdminMissing() {
        ForbiddenRequestException e = assertThrows(
            ForbiddenRequestException.class,
            () -> fixture.findMineOrAllByArchived(true, false, Pageable.unpaged())
        );
        assertThat(e).hasMessage("You're not allowed to see all projects!");
    }

    @Test
    void findMineOrAllByArchivedByArchivedLoadsAllWhenAdminAuthorityAssigned() {
        boolean archived = true;
        Pageable pageable = Pageable.unpaged();

        doReturn(Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN)))
            .when(authenticationMock)
            .getAuthorities();

        fixture.findMineOrAllByArchived(Boolean.TRUE, archived, pageable);

        verify(projectRepositoryMock).findAllByArchived(archived, pageable);
    }

    @Test
    void createThrowsErrorOnInvalidStartEndTimeCombination() {
        ZonedDateTime startTime = ZonedDateTime.now();
        ZonedDateTime endTime = startTime.minus(1, ChronoUnit.MINUTES);

        CreateProjectDTO createProjectDTO = new CreateProjectDTO();
        createProjectDTO.setStartTime(startTime);
        createProjectDTO.setEndTime(endTime);

        ConstraintViolationProblem e = catchThrowableOfType(() -> fixture.create(createProjectDTO), ConstraintViolationProblem.class);
        assertThat(e)
            .hasFieldOrPropertyWithValue("status", Status.BAD_REQUEST)
            .extracting(problem -> ((ConstraintViolationProblem) problem).getViolations().get(0))
            .hasFieldOrPropertyWithValue("field", "endTime")
            .hasFieldOrPropertyWithValue("message", "endTime may not occur before startTime!");
    }
}
