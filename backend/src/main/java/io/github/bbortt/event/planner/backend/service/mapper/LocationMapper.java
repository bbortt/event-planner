package io.github.bbortt.event.planner.backend.service.mapper;

import io.github.bbortt.event.planner.backend.domain.Location;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.service.UserService;
import io.github.bbortt.event.planner.backend.service.dto.LocationDTO;
import io.github.bbortt.event.planner.backend.service.dto.SectionDTO;
import io.github.bbortt.event.planner.backend.service.dto.UserDTO;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class LocationMapper {

    private final UserService userService;

    public LocationMapper(UserService userService) {
        this.userService = userService;
    }

    public LocationDTO dtoFromLocation(Location location, Set<SectionDTO> sectionDTOs) {
        if (location == null) {
            return null;
        } else {
            UserDTO user = Optional
                .ofNullable(location.getJhiUserId())
                .map(jhiUserId -> userService.getById(jhiUserId).orElseThrow(IllegalAccessError::new))
                .orElse(null);

            LocationDTO locationDTO = new LocationDTO();
            locationDTO.setId(location.getId());
            locationDTO.setName(location.getName());
            locationDTO.setProject(location.getProject());
            locationDTO.setResponsibility(location.getResponsibility());
            locationDTO.setSections(sectionDTOs);
            locationDTO.setLocationTimeSlots(location.getLocationTimeSlots());
            locationDTO.setUser(user);

            return locationDTO;
        }
    }

    public Location locationFromDTO(LocationDTO locationDTO, Set<Section> sections) {
        if (locationDTO == null) {
            return null;
        } else {
            Location location = new Location()
                .id(locationDTO.getId())
                .name(locationDTO.getName())
                .project(locationDTO.getProject())
                .responsibility(locationDTO.getResponsibility())
                .sections(sections)
                .locationTimeSlots(locationDTO.getLocationTimeSlots());

            if (locationDTO.getUser() != null) {
                location.setJhiUserId(locationDTO.getUser().getId());
            }

            return location;
        }
    }
}
