package io.github.bbortt.event.planner.backend.service;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.backend.repository.InvitationRepository;
import io.github.bbortt.event.planner.backend.repository.ProjectRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.repository.UserRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.dto.CreateProjectDTO;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import org.assertj.core.api.Assertions;
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
@TestExecutionListeners({WithSecurityContextTestExecutionListener.class})
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
        doReturn(MOCK_USER_LOGIN).when(authenticationMock).getPrincipal();

        TestSecurityContextHolder.setAuthentication(authenticationMock);

        fixture =
            new ProjectService(roleServiceMock, userRepositoryMock, roleRepositoryMock, projectRepositoryMock, invitationRepositoryMock);
    }

    @Test
    void findMineOrAllByArchivedDoesLoadMine() {
        Pageable pageable = Pageable.unpaged();

        fixture.findMineOrAllByArchived(false, false, pageable);
        verify(projectRepositoryMock).findMineByArchived(MOCK_USER_LOGIN, false, pageable);

        fixture.findMineOrAllByArchived(false, true, pageable);
        verify(projectRepositoryMock).findMineByArchived(MOCK_USER_LOGIN, true, pageable);
    }

    @Test
    void findMineOrAllByArchivedThrowsExceptionIfAuthorityAdminMissing() {
        Assertions.assertThatThrownBy(() -> fixture.findMineOrAllByArchived(true, false, Pageable.unpaged()))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("You're not allowed to see all projects!");
    }

    @Test
    void findMineOrAllByArchivedByArchivedLoadsAllWhenAdminAuthorityAssigned() {
        Pageable pageable = Pageable.unpaged();

        doReturn(Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN)))
            .when(authenticationMock)
            .getAuthorities();

        fixture.findMineOrAllByArchived(Boolean.TRUE, false, pageable);

        verify(projectRepositoryMock).findAll(pageable);
    }

    @Test
    void createThrowsErrorOnInvalidStartEndTimeCombination() {
        ZonedDateTime startTime = ZonedDateTime.now();
        ZonedDateTime endTime = startTime.minus(1, ChronoUnit.MINUTES);

        CreateProjectDTO createProjectDTO = new CreateProjectDTO();
        createProjectDTO.setStartTime(startTime);
        createProjectDTO.setEndTime(endTime);

        Assertions.assertThatThrownBy(() -> fixture.create(createProjectDTO))
            .isInstanceOf(ConstraintViolationProblem.class)
            .hasFieldOrPropertyWithValue("status", is(equalTo(Status.BAD_REQUEST)))
            .hasFieldOrPropertyWithValue("violations",
                contains(
                    allOf(
                        hasProperty("field", is(equalTo("endTime"))),
                        hasProperty("message", is(equalTo("endTime may not occur before startTime!")))
                    )
                )
            );
    }
}
