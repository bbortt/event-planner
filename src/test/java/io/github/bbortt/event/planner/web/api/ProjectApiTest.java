package io.github.bbortt.event.planner.web.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.GetUserProjects200Response;
import io.github.bbortt.event.planner.service.api.dto.Project;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectMapper;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ProjectApiTest {

    @Mock
    private ProjectService projectServiceMock;

    @Mock
    private ApiProjectMapper apiProjectMapperMock;

    @Mock
    private PaginationUtil paginationUtilMock;

    private ProjectApiDelegate fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new ProjectApiDelegateImpl(projectServiceMock, apiProjectMapperMock, paginationUtilMock);
    }

    @Test
    void findProjectByToken() {
        String projectToken = "2fdbfe19-b872-4fde-b8bd-f49a4ac3149b";

        ProjectDTO projectDTO = new ProjectDTO();
        doReturn(Optional.of(projectDTO)).when(projectServiceMock).findOneByToken(projectToken);

        Project project = new Project();
        doReturn(project).when(apiProjectMapperMock).toApiDTO(projectDTO);

        ResponseEntity<Project> result = fixture.findProjectByToken(projectToken);

        assertEquals(HttpStatus.OK, result.getStatusCode());

        Project response = result.getBody();
        assertNotNull(response);
        assertEquals(project, response);
    }

    @Test
    void findProjectByTokenNotFound() {
        String projectToken = "cc48d8a7-c01a-47d5-af2b-d13e01bb4c23";
        doReturn(Optional.empty()).when(projectServiceMock).findOneByToken(projectToken);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> fixture.findProjectByToken(projectToken));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void testGetUserProjects() {
        int pageSize = 10;
        int pageNumber = 0;
        List<String> sort = Collections.singletonList("id,asc");

        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);
        doReturn(pageRequest)
            .when(paginationUtilMock)
            .createPagingInformation(Optional.of(pageSize), Optional.of(pageNumber), Optional.of(sort), "id");

        ProjectDTO projectDTO = new ProjectDTO();
        Slice<ProjectDTO> slice = new PageImpl<>(List.of(projectDTO), pageRequest, 100);
        doReturn(slice).when(projectServiceMock).findAllNotArchivedForCurrentUser(pageRequest);

        HttpHeaders httpHeaders = new HttpHeaders();
        doReturn(httpHeaders).when(paginationUtilMock).generateSliceHttpHeaders(slice);

        Project project = new Project();
        doReturn(project).when(apiProjectMapperMock).toApiDTO(projectDTO);

        ResponseEntity<GetUserProjects200Response> result = fixture.getUserProjects(
            Optional.of(pageSize),
            Optional.of(pageNumber),
            Optional.of(sort)
        );

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(httpHeaders, result.getHeaders());

        GetUserProjects200Response response = result.getBody();
        assertNotNull(response);

        assertEquals(1, response.getContents().size());
        assertEquals(project, response.getContents().get(0));
    }
}
