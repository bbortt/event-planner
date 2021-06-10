package io.github.bbortt.event.planner.backend.web.rest;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.backend.service.EventHistoryService;
import java.time.ZonedDateTime;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@ExtendWith(MockitoExtension.class)
class EventHistoryResourceUnitTest {

    @Mock
    EventHistoryService eventHistoryServiceMock;

    EventHistoryResource fixture;

    @BeforeEach
    public void beforeEachSetup() {
        HttpServletRequest mockRequest = new MockHttpServletRequest();
        ServletRequestAttributes servletRequestAttributes = new ServletRequestAttributes(mockRequest);
        RequestContextHolder.setRequestAttributes(servletRequestAttributes);

        fixture = new EventHistoryResource(eventHistoryServiceMock);
    }

    @AfterEach
    public void afterEachTeardown() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void getAllEventsLoadsAllEventsWithoutSince() {
        Long projectId = 1234L;
        Pageable pageable = Pageable.unpaged();

        doReturn(Page.empty(pageable)).when(eventHistoryServiceMock).findAllByProjectId(projectId, pageable);

        fixture.getAllEvents(projectId, Optional.empty(), pageable);

        verify(eventHistoryServiceMock).findAllByProjectId(projectId, pageable);
    }

    @Test
    void getAllEventsLoadsEventsSinceWithParameter() {
        Long projectId = 1234L;
        ZonedDateTime showSince = ZonedDateTime.now();
        Pageable pageable = Pageable.unpaged();

        doReturn(Page.empty(pageable)).when(eventHistoryServiceMock).findAllByProjectIdSince(projectId, showSince, pageable);

        fixture.getAllEvents(projectId, Optional.of(showSince), pageable);

        verify(eventHistoryServiceMock).findAllByProjectIdSince(projectId, showSince, pageable);
    }
}
