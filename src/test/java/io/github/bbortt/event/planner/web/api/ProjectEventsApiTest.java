package io.github.bbortt.event.planner.web.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;

import io.github.bbortt.event.planner.service.EventService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.service.api.dto.Event;
import io.github.bbortt.event.planner.service.api.dto.GetProjectEvents200Response;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import io.github.bbortt.event.planner.service.dto.ProjectDTO;
import io.github.bbortt.event.planner.web.api.mapper.ApiProjectEventMapper;
import io.github.bbortt.event.planner.web.rest.errors.EntityNotFoundAlertException;
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
class ProjectEventsApiTest {

    @Mock
    private EventService eventServiceMock;

    @Mock
    private ProjectService projectServiceMock;

    @Mock
    private ApiProjectEventMapper apiProjectEventMapperMock;

    @Mock
    private PaginationUtil paginationUtilMock;

    private ProjectEventsApiDelegateImpl fixture;

    @BeforeEach
    void beforeEachSetup() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        fixture = new ProjectEventsApiDelegateImpl(eventServiceMock, projectServiceMock, apiProjectEventMapperMock, paginationUtilMock);
    }

    @Test
    void getProjectEventsCallsService() {
        Long projectId = 1234L;

        Optional<Integer> pageSize = Optional.of(10);
        Optional<Integer> pageNumber = Optional.of(0);
        Optional<List<String>> sort = Optional.of(Collections.singletonList("id,asc"));

        PageRequest pageRequest = PageRequest.of(pageNumber.orElseThrow(), pageSize.orElseThrow());
        doReturn(pageRequest).when(paginationUtilMock).createPagingInformation(pageSize, pageNumber, sort, "id");

        // Project by ID exists
        doReturn(new ProjectDTO()).when(projectServiceMock).findOneOrThrowEntityNotFoundAlertException(projectId);

        EventDTO eventDTO = new EventDTO();
        Page<EventDTO> page = new PageImpl<>(List.of(eventDTO));
        doReturn(page).when(eventServiceMock).findAllInProject(projectId, pageRequest);

        HttpHeaders httpHeaders = new HttpHeaders();
        doReturn(httpHeaders).when(paginationUtilMock).generatePaginationHttpHeaders(any(ServletUriComponentsBuilder.class), eq(page));

        Event event = new Event();
        doReturn(event).when(apiProjectEventMapperMock).toApiDTO(eventDTO);

        ResponseEntity<GetProjectEvents200Response> result = fixture.getProjectEvents(projectId, pageSize, pageNumber, sort);

        assertEquals(HttpStatus.OK, result.getStatusCode());

        GetProjectEvents200Response response = result.getBody();
        assertNotNull(response);

        assertEquals(1, response.getContents().size());
        assertEquals(event, response.getContents().get(0));
    }

    @Test
    void getProjectEventsForNonexistentProject() {
        Long projectId = 1L;

        Optional<Integer> pageSize = Optional.of(10);
        Optional<Integer> pageNumber = Optional.of(0);
        Optional<List<String>> sort = Optional.of(Collections.singletonList("id,asc"));

        // Project by ID does not exist
        EntityNotFoundAlertException entityNotFoundAlertException = mock(EntityNotFoundAlertException.class);
        doThrow(entityNotFoundAlertException).when(projectServiceMock).findOneOrThrowEntityNotFoundAlertException(projectId);

        EntityNotFoundAlertException exception = assertThrows(
            EntityNotFoundAlertException.class,
            () -> fixture.getProjectEvents(projectId, pageSize, pageNumber, sort)
        );

        assertEquals(entityNotFoundAlertException, exception);
    }
}
