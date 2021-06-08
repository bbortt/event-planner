package io.github.bbortt.event.planner.backend.service.mapper;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.service.UserService;
import io.github.bbortt.event.planner.backend.service.dto.EventDTO;
import io.github.bbortt.event.planner.backend.service.dto.SectionDTO;
import io.github.bbortt.event.planner.backend.service.dto.UserDTO;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    private final UserService userService;

    public EventMapper(UserService userService) {
        this.userService = userService;
    }

    public EventDTO dtoFromEvent(Event event, SectionDTO sectionDTO) {
        if (event == null) {
            return null;
        } else {
            UserDTO user = Optional.ofNullable(event.getJhiUserId()).map(userService::getById).orElse(null);

            EventDTO eventDTO = new EventDTO();
            eventDTO.setId(event.getId());
            eventDTO.setName(event.getName());
            eventDTO.setDescription(event.getDescription());
            eventDTO.setStartTime(event.getStartTime());
            eventDTO.setEndTime(event.getEndTime());
            eventDTO.setSection(sectionDTO);
            eventDTO.setResponsibility(event.getResponsibility());
            eventDTO.setUser(user);

            return eventDTO;
        }
    }

    public Event eventFromDTO(EventDTO eventDTO, Section section) {
        if (eventDTO == null) {
            return null;
        } else {
            Event event = new Event()
                .id(eventDTO.getId())
                .name(eventDTO.getName())
                .description(eventDTO.getDescription())
                .startTime(eventDTO.getStartTime())
                .endTime(eventDTO.getEndTime())
                .section(section)
                .responsibility(eventDTO.getResponsibility());

            if (eventDTO.getUser() != null) {
                event.setJhiUserId(eventDTO.getUser().getId());
            }

            return event;
        }
    }
}
