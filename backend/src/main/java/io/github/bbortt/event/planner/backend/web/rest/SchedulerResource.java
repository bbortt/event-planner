package io.github.bbortt.event.planner.backend.web.rest;

import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.Responsibility;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.security.RolesConstants;
import io.github.bbortt.event.planner.backend.service.InvitationService;
import io.github.bbortt.event.planner.backend.service.ProjectService;
import io.github.bbortt.event.planner.backend.service.ResponsibilityService;
import io.github.bbortt.event.planner.backend.service.SectionService;
import io.github.bbortt.event.planner.backend.service.dto.scheduler.SchedulerColorGroupDTO;
import io.github.bbortt.event.planner.backend.service.dto.scheduler.SchedulerEventDTO;
import io.github.bbortt.event.planner.backend.service.dto.scheduler.SchedulerLocationDTO;
import io.github.bbortt.event.planner.backend.service.dto.scheduler.SchedulerSectionDTO;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SchedulerResource {

    private static final Logger log = LoggerFactory.getLogger(SchedulerResource.class);

    private final InvitationService invitationService;
    private final SectionService sectionService;
    private final ProjectService projectService;
    private final ResponsibilityService responsibilityService;

    public SchedulerResource(
        InvitationService invitationService,
        SectionService sectionService,
        ProjectService projectService,
        ResponsibilityService responsibilityService
    ) {
        this.invitationService = invitationService;
        this.sectionService = sectionService;
        this.projectService = projectService;
        this.responsibilityService = responsibilityService;
    }

    @GetMapping("/scheduler/project/{projectId}/responsibilities")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#projectId, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\", \"" +
        RolesConstants.CONTRIBUTOR +
        "\", \"" +
        RolesConstants.VIEWER +
        "\")"
    )
    public ResponseEntity<List<SchedulerColorGroupDTO>> getProjectColorGroups(@PathVariable Long projectId) {
        log.debug("REST Request to get color groups by projectId {}", projectId);
        List<Responsibility> responsibilities = responsibilityService.findAllByProjectId(projectId, Sort.unsorted());
        List<SchedulerColorGroupDTO> schedulerColorGroups = responsibilities
            .stream()
            .map(
                responsibility ->
                    new SchedulerColorGroupDTO(
                        Responsibility.class.getSimpleName().toLowerCase() + "-" + responsibility.getId(),
                        responsibility.getColor()
                    )
            )
            .collect(Collectors.toList());
        return ResponseEntity.ok(schedulerColorGroups);
    }

    @GetMapping("/scheduler/project/{projectId}/location/{locationId}")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#projectId, \"" +
        RolesConstants.ADMIN +
        "\", \"" +
        RolesConstants.SECRETARY +
        "\", \"" +
        RolesConstants.CONTRIBUTOR +
        "\", \"" +
        RolesConstants.VIEWER +
        "\")"
    )
    public ResponseEntity<SchedulerLocationDTO> getSchedulerLocationById(@PathVariable Long projectId, @PathVariable Long locationId) {
        log.debug("REST Request to get Scheduler information by locationId {}", locationId);
        List<Section> sections = sectionService.findAllByLocationIdJoinEvents(locationId);
        return ResponseEntity.ok(toSchedulerLocationDTO(sections));
    }

    private SchedulerLocationDTO toSchedulerLocationDTO(List<Section> sections) {
        List<SchedulerEventDTO> schedulerEvents = new ArrayList<>();
        List<SchedulerSectionDTO> schedulerSections = new ArrayList<>();
        Set<SchedulerColorGroupDTO> schedulerColorGroups = new HashSet<>();

        sections.forEach(
            section -> {
                schedulerSections.add(toSchedulerSectionDTO(section));
                section
                    .getEvents()
                    .forEach(
                        event -> {
                            schedulerEvents.add(toSchedulerEventDTO(section, event));
                            schedulerColorGroups.add(toSchedulerColorGroupDTO(section, event));
                        }
                    );
            }
        );

        return new SchedulerLocationDTO(schedulerEvents, schedulerSections, new ArrayList<>(schedulerColorGroups));
    }

    private SchedulerColorGroupDTO toSchedulerColorGroupDTO(Section section, Event event) {
        String color = null;
        String colorGroupId = null;

        if (event.getResponsibility() != null) {
            color = event.getResponsibility().getColor();
            colorGroupId = Responsibility.class.getSimpleName().toLowerCase() + "-" + event.getResponsibility().getId();
        } else if (event.getJhiUserId() != null) {
            color =
                this.invitationService.findOneByJhiUserIdAndProjectId(event.getJhiUserId(), section.getLocation().getProject().getId())
                    .orElseThrow(IllegalArgumentException::new)
                    .getColor();
            colorGroupId = "user-" + event.getJhiUserId();
        }

        return new SchedulerColorGroupDTO(colorGroupId, color);
    }

    private SchedulerSectionDTO toSchedulerSectionDTO(Section section) {
        return new SchedulerSectionDTO(section.getId(), section.getName(), section);
    }

    private SchedulerEventDTO toSchedulerEventDTO(Section section, Event event) {
        String colorGroupId = null;

        if (event.getResponsibility() != null) {
            colorGroupId = Responsibility.class.getSimpleName().toLowerCase() + "-" + event.getResponsibility().getId();
        } else if (event.getJhiUserId() != null) {
            colorGroupId = "user-" + event.getJhiUserId();
        }

        return new SchedulerEventDTO(
            event.getName(),
            event.getDescription(),
            event.getStartTime(),
            event.getEndTime(),
            section.getId(),
            colorGroupId,
            event
        );
    }
}
