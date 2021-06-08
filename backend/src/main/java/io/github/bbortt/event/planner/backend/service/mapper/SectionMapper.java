package io.github.bbortt.event.planner.backend.service.mapper;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.Location;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.service.UserService;
import io.github.bbortt.event.planner.backend.service.dto.EventDTO;
import io.github.bbortt.event.planner.backend.service.dto.LocationDTO;
import io.github.bbortt.event.planner.backend.service.dto.SectionDTO;
import io.github.bbortt.event.planner.backend.service.dto.UserDTO;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class SectionMapper {

    private final UserService userService;

    public SectionMapper(UserService userService) {
        this.userService = userService;
    }

    public SectionDTO dtoFromSection(Section section, LocationDTO locationDTO, Set<EventDTO> eventDTOS) {
        if (section == null) {
            return null;
        } else {
            UserDTO user = Optional.ofNullable(section.getJhiUserId()).map(userService::getById).orElse(null);

            SectionDTO sectionDTO = new SectionDTO();
            sectionDTO.setId(section.getId());
            sectionDTO.setName(section.getName());
            sectionDTO.setLocation(locationDTO);
            sectionDTO.setEvents(eventDTOS);
            sectionDTO.setResponsibility(section.getResponsibility());
            sectionDTO.setUser(user);

            return sectionDTO;
        }
    }

    public Section sectionFromDTO(SectionDTO sectionDTO, Location location, Set<Event> events) {
        if (sectionDTO == null) {
            return null;
        } else {
            Section section = new Section()
                .id(sectionDTO.getId())
                .name(sectionDTO.getName())
                .location(location)
                .events(events)
                .responsibility(sectionDTO.getResponsibility());

            if (sectionDTO.getUser() != null) {
                section.setJhiUserId(sectionDTO.getUser().getId());
            }

            return section;
        }
    }
}
