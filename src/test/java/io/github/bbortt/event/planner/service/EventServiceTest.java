package io.github.bbortt.event.planner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.repository.EventRepository;
import io.github.bbortt.event.planner.service.dto.EventDTO;
import io.github.bbortt.event.planner.service.mapper.EventMapper;
import io.github.bbortt.event.planner.web.rest.EventResource;
import io.github.bbortt.event.planner.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

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
    void saveChecksMandatoryLocationConstraint() {
        Event event = new Event(); // Note, has no Location
        EventDTO eventDTO = new EventDTO();

        doReturn(event).when(eventMapperMock).toEntity(eventDTO);

        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> fixture.save(eventDTO));

        assertEquals(EventResource.ENTITY_NAME, exception.getEntityName());
        assertEquals("event.constraints.location", exception.getErrorKey());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        verifyNoInteractions(eventRepositoryMock);
    }

    @Test
    void saveChecksMandatoryStartDateTimeBeforeEndDateTime() {
        Event event = new Event().startDateTime(Instant.MAX).endDateTime(Instant.MIN).location(new Location().id(1234L)); // In order to fullfill the Location constraint

        EventDTO eventDTO = new EventDTO();

        doReturn(event).when(eventMapperMock).toEntity(eventDTO);

        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> fixture.save(eventDTO));

        assertEquals(EventResource.ENTITY_NAME, exception.getEntityName());
        assertEquals("event.validation.startDateTimeBeforeEndDateTime", exception.getErrorKey());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        verifyNoInteractions(eventRepositoryMock);
    }

    @Test
    void updateChecksMandatoryLocationConstraint() {
        Event event = new Event(); // Note, has no Location
        EventDTO eventDTO = new EventDTO();

        doReturn(event).when(eventMapperMock).toEntity(eventDTO);

        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> fixture.update(eventDTO));

        assertEquals(EventResource.ENTITY_NAME, exception.getEntityName());
        assertEquals("event.constraints.location", exception.getErrorKey());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        verifyNoInteractions(eventRepositoryMock);
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
