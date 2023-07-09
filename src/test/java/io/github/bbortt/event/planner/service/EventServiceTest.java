package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.repository.EventRepository;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import io.github.bbortt.event.planner.service.mapper.EventMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventMapper eventMapperMock;

    @Mock
    private EventRepository eventRepositoryMock;

    private EventService fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new EventService(eventRepositoryMock, eventMapperMock);
    }

    @Test
    void findAllInProjectCallsRepository() {
        Long projectId = 1234l;
        Pageable pageable = Pageable.unpaged();

        Event event = new Event();
        EventDTO eventDTO = new EventDTO();

        doReturn(new PageImpl<>(List.of(event))).when(eventRepositoryMock).findAllByLocation_Project_IdEquals(projectId, pageable);
        doReturn(eventDTO).when(eventMapperMock).toDto(event);

        Page<EventDTO> result = fixture.findAllInProject(projectId, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals(eventDTO, result.getContent().get(0));

        verify(eventRepositoryMock).findAllByLocation_Project_IdEquals(projectId, pageable);
    }
}
