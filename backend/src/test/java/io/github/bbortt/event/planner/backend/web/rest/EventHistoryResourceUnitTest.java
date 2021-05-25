package io.github.bbortt.event.planner.backend.web.rest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.backend.service.EventHistoryService;
import io.github.bbortt.event.planner.backend.service.ProjectService;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class EventHistoryResourceUnitTest {

    @Mock
    EventHistoryService eventHistoryServiceMock;

    @Mock
    ProjectService projectServiceMock;

    EventHistoryResource fixture;

    @BeforeEach
    public void beforeEachSetup() {
        fixture = new EventHistoryResource(eventHistoryServiceMock, projectServiceMock);
    }

    @Test
    void getAllEventsLoadsAllEventsWithoutSince() {
        Long projectId = 1234L;
        Pageable pageable = Pageable.unpaged();

        fixture.getAllEvents(projectId, Optional.empty(), pageable);

        verify(eventHistoryServiceMock).findAllByProjectId(projectId, pageable);
    }

    @Test
    void getAllEventsLoadsEventsSinceWithParameter() {
        Long projectId = 1234L;
        ZonedDateTime showSince = ZonedDateTime.now();
        Pageable pageable = Pageable.unpaged();

        fixture.getAllEvents(projectId, Optional.of(showSince), pageable);

        verify(eventHistoryServiceMock).findAllByProjectIdSince(projectId, showSince, pageable);
    }
}
