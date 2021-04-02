package io.github.bbortt.event.planner.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.backend.repository.InvitationRepository;
import io.github.bbortt.event.planner.backend.repository.ProjectRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.dto.CreateProjectDTO;
import io.github.bbortt.event.planner.backend.service.exception.ForbiddenRequestException;
import io.github.bbortt.event.planner.backend.web.rest.TestUtil;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
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
    RoleService roleServiceMock;

    @Mock
    UserService userServiceMock;

    @Mock
    RoleRepository roleRepositoryMock;

    @Mock
    ProjectRepository projectRepositoryMock;

    @Mock
    InvitationRepository invitationRepositoryMock;

    Map<String, Object> userDetails;
    ProjectService fixture;

    @BeforeEach
    void beforeTestSetup() {
        userDetails = new HashMap<>();
        userDetails.put("sub", MOCK_USER_LOGIN);

        fixture = new ProjectService(roleServiceMock, userServiceMock, roleRepositoryMock, projectRepositoryMock, invitationRepositoryMock);
    }

    @Test
    void findMineOrAllByArchivedDoesLoadMine() {
        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

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

        TestSecurityContextHolder.setAuthentication(
            TestUtil.createMockOAuth2AuthenticationToken(
                userDetails,
                Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN))
            )
        );

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
