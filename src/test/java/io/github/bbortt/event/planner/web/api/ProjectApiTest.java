package io.github.bbortt.event.planner.web.api;

import static org.mockito.Mockito.doReturn;

import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.rest.util.PaginationUtil;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.http.HttpHeaders;

@ExtendWith(MockitoExtension.class)
class ProjectApiTest {

    @Mock
    private ProjectService projectServiceMock;

    @Mock
    private PaginationUtil paginationUtilMock;

    private ProjectApiDelegateImpl fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new ProjectApiDelegateImpl(projectServiceMock, paginationUtilMock);
    }

    @Test
    void getUserProjectsTranslatesPaginationInformation() {
        Optional<Integer> pageSize = Optional.of(1234);
        Optional<Integer> pageNumber = Optional.of(1234);
        Optional<List<String>> sort = Optional.of(List.of("id"));

        Pageable pageable = Pageable.unpaged();
        doReturn(pageable).when(paginationUtilMock).createPagingInformation(pageSize, pageNumber, sort, "id");

        ProjectDTO projectDTO = new ProjectDTO();
        Slice<ProjectDTO> projectDTOSlice = new SliceImpl<>(List.of(projectDTO));
        doReturn(projectDTOSlice).when(projectServiceMock).findAllNotArchivedForCurrentUser(pageable);

        HttpHeaders httpHeaders = new HttpHeaders();
        doReturn(httpHeaders).when(paginationUtilMock).generateSliceHttpHeaders(projectDTOSlice);

        Project project = new Project();
        // doReturn(project).when()

        // ResponseEntity<GetUserProjects200Response> result = fixture.getUserProjects(pageSize, pageNumber, sort);

        // assertEquals(httpHeaders, result.getHeaders());
        // assertNotNull(result.getBody());
        // assertEquals(1, result.getBody().getContents().size());
        // assertEquals(projectDTO, result.getBody().getContents().get(0));
    }
}
