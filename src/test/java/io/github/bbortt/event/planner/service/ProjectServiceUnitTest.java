package io.github.bbortt.event.planner.service;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.repository.UserRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.service.dto.CreateProjectDTO;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListeners;
import org.zalando.problem.Status;
import org.zalando.problem.violations.ConstraintViolationProblem;

@TestExecutionListeners({ WithSecurityContextTestExecutionListener.class })
class ProjectServiceUnitTest {

    static final String MOCK_USER_LOGIN = "mock-user-login";

    @Rule
    MockitoRule mockitoRule = MockitoJUnit.rule();

    @Rule
    ExpectedException expectedException = ExpectedException.none();

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

    @Before
    void beforeTestSetup() {
        doReturn(MOCK_USER_LOGIN).when(authenticationMock).getPrincipal();

        TestSecurityContextHolder.setAuthentication(authenticationMock);

        fixture =
            new ProjectService(roleServiceMock, userRepositoryMock, roleRepositoryMock, projectRepositoryMock, invitationRepositoryMock);
    }

    @Test
    void findMineOrAllDoesLoadMine() {
        Pageable pageable = Pageable.unpaged();

        fixture.findMineOrAll(Boolean.FALSE, pageable);

        verify(projectRepositoryMock).findMine(MOCK_USER_LOGIN, pageable);
    }

    @Test
    void findMineOrAllThrowsExceptionIfAuthorityAdminMissing() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("You're not allowed to see all projects!");
        fixture.findMineOrAll(Boolean.TRUE, Pageable.unpaged());
    }

    @Test
    void findMineOrAllLoadsAllWhenAdminAuthorityAssigned() {
        Pageable pageable = Pageable.unpaged();

        doReturn(Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN)))
            .when(authenticationMock)
            .getAuthorities();

        fixture.findMineOrAll(Boolean.TRUE, pageable);

        verify(projectRepositoryMock).findAll(pageable);
    }

    @Test
    void createThrowsErrorOnInvalidStartEndTimeCombination() {
        ZonedDateTime startTime = ZonedDateTime.now();
        ZonedDateTime endTime = startTime.minus(1, ChronoUnit.MINUTES);

        CreateProjectDTO createProjectDTO = new CreateProjectDTO();
        createProjectDTO.setStartTime(startTime);
        createProjectDTO.setEndTime(endTime);

        expectedException.expect(ConstraintViolationProblem.class);
        expectedException.expect(hasProperty("status", is(equalTo(Status.BAD_REQUEST))));
        expectedException.expect(
            hasProperty(
                "violations",
                contains(
                    allOf(
                        hasProperty("field", is(equalTo("endTime"))),
                        hasProperty("message", is(equalTo("endTime may not occur before startTime!")))
                    )
                )
            )
        );
        fixture.create(createProjectDTO);
    }
}
