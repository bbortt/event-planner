package io.github.bbortt.event.planner.service.dto.scheduler;

import java.util.List;

public class SchedulerLocationDTO {

    private List<SchedulerSectionDTO> sections;
    private List<SchedulerColorGroupDTO> colorGroups;

    public SchedulerLocationDTO(List<SchedulerSectionDTO> sections, List<SchedulerColorGroupDTO> colorGroups) {
        this.sections = sections;
        this.colorGroups = colorGroups;
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
