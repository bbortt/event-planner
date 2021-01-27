package io.github.bbortt.event.planner.service.dto.scheduler;

import io.github.bbortt.event.planner.domain.Section;
import java.util.List;

public class SchedulerSectionDTO {

    private Long id;
    private String text;
    private List<SchedulerEventDTO> events;
    private Section originalSection;

    public SchedulerSectionDTO(Long id, String text, List<SchedulerEventDTO> events, Section originalSection) {
        this.id = id;
        this.text = text;
        this.events = events;
        this.originalSection = originalSection;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<SchedulerEventDTO> getEvents() {
        return events;
    }

    public void setEvents(List<SchedulerEventDTO> events) {
        this.events = events;
    }

    public Section getOriginalSection() {
        return originalSection;
    }

    public void setOriginalSection(Section originalSection) {
        this.originalSection = originalSection;
    }
}
