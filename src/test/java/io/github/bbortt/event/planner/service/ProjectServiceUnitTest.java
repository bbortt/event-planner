package io.github.bbortt.event.planner.service;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.repository.InvitationRepository;
import io.github.bbortt.event.planner.repository.ProjectRepository;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.repository.UserRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
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

@TestExecutionListeners({ WithSecurityContextTestExecutionListener.class })
public class ProjectServiceUnitTest {
    static final String MOCK_USER_LOGIN = "mock-user-login";

    @Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Mock
    Authentication authenticationMock;

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
    public void beforeTestSetup() {
        doReturn(MOCK_USER_LOGIN).when(authenticationMock).getPrincipal();

        TestSecurityContextHolder.setAuthentication(authenticationMock);

        fixture = new ProjectService(userRepositoryMock, roleRepositoryMock, projectRepositoryMock, invitationRepositoryMock);
    }

    @Test
    public void findMineOrAllDoesLoadMine() {
        Pageable pageable = Pageable.unpaged();

        fixture.findMineOrAll(Boolean.FALSE, pageable);

        verify(projectRepositoryMock).findMine(MOCK_USER_LOGIN, pageable);
    }

    @Test
    public void findMineOrAllThrowsExceptionIfAuthorityAdminMissing() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("You're not allowed to see all projects!");
        fixture.findMineOrAll(Boolean.TRUE, Pageable.unpaged());
    }

    @Test
    public void findMineOrAllLoadsAllWhenAdminAuthorityAssigned() {
        Pageable pageable = Pageable.unpaged();

        doReturn(Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN)))
            .when(authenticationMock)
            .getAuthorities();

        fixture.findMineOrAll(Boolean.TRUE, pageable);

        verify(projectRepositoryMock).findAll(pageable);
    }
}
