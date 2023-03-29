package io.github.bbortt.event.planner.web.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.service.MemberService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetProjectMembers200Response;
import io.github.bbortt.event.planner.service.api.dto.Member;
import io.github.bbortt.event.planner.service.dto.MemberDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectMemberMapper;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@ExtendWith(MockitoExtension.class)
public class ProjectMemberApiTest {

    @Mock
    private MemberService memberServiceMock;

    @Mock
    private ProjectService projectServiceMock;

    @Mock
    private ApiProjectMemberMapper apiProjectMemberMapperMock;

    @Mock
    private PaginationUtil paginationUtilMock;

    private ProjectMemberApiDelegate fixture;

    @BeforeEach
    void beforeEachSetup() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        fixture = new ProjectMemberApiDelegateImpl(memberServiceMock, projectServiceMock, apiProjectMemberMapperMock, paginationUtilMock);
    }

    @Test
    void getProjectMembersForExistingProject() {
        Long projectId = 1L;

        int pageSize = 10;
        int pageNumber = 0;
        List<String> sort = Collections.singletonList("id,asc");

        // Project by ID exists
        doReturn(true).when(projectServiceMock).exists(projectId);

        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);
        doReturn(pageRequest)
            .when(paginationUtilMock)
            .createPagingInformation(Optional.of(pageSize), Optional.of(pageNumber), Optional.of(sort), "id");

        MemberDTO memberDTO = new MemberDTO();
        Page<MemberDTO> page = new PageImpl<>(List.of(memberDTO));
        doReturn(page).when(memberServiceMock).findInProject(projectId, pageRequest);

        HttpHeaders httpHeaders = new HttpHeaders();
        doReturn(httpHeaders).when(paginationUtilMock).generatePaginationHttpHeaders(any(ServletUriComponentsBuilder.class), eq(page));

        Member member = new Member();
        doReturn(member).when(apiProjectMemberMapperMock).toApiDTO(memberDTO);

        ResponseEntity<GetProjectMembers200Response> result = fixture.getProjectMembers(
            projectId,
            Optional.of(pageSize),
            Optional.of(pageNumber),
            Optional.of(sort)
        );

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(httpHeaders, result.getHeaders());

        GetProjectMembers200Response response = result.getBody();
        assertNotNull(response);

        assertEquals(1, response.getContents().size());
        assertEquals(member, response.getContents().get(0));
    }

    @Test
    void getProjectMembersForNonexistentProject() {
        Long projectId = 1L;

        int pageSize = 10;
        int pageNumber = 0;
        List<String> sort = Collections.singletonList("id,asc");

        // Project by ID does not exist
        doReturn(false).when(projectServiceMock).exists(projectId);

        ResponseEntity<GetProjectMembers200Response> result = fixture.getProjectMembers(
            projectId,
            Optional.of(pageSize),
            Optional.of(pageNumber),
            Optional.of(sort)
        );

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    }
}
