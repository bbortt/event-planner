package io.github.bbortt.event.planner.service.dto.scheduler;

import java.util.List;

public class SchedulerLocationDTO {

    private List<SchedulerEventDTO> events;
    private List<SchedulerSectionDTO> sections;
    private List<SchedulerColorGroupDTO> colorGroups;

    public SchedulerLocationDTO(
        List<SchedulerEventDTO> events,
        List<SchedulerSectionDTO> sections,
        List<SchedulerColorGroupDTO> colorGroups
    ) {
        this.events = events;
        this.sections = sections;
        this.colorGroups = colorGroups;
    }

    public List<SchedulerEventDTO> getEvents() {
        return events;
    }

    public void setEvents(List<SchedulerEventDTO> events) {
        this.events = events;
    }

    public List<SchedulerSectionDTO> getSections() {
        return sections;
    }

    public void setSections(List<SchedulerSectionDTO> sections) {
        this.sections = sections;
    }

    public List<SchedulerColorGroupDTO> getColorGroups() {
        return colorGroups;
    }

    public void setColorGroups(List<SchedulerColorGroupDTO> colorGroups) {
        this.colorGroups = colorGroups;
    }
}
