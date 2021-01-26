package io.github.bbortt.event.planner.service.dto;

import io.github.bbortt.event.planner.domain.Section;
import java.util.List;

public class SchedulerSectionDTO {

    private Long id;
    private String text;
    private List<SchedulerEventDTO> events;
    private Section originalSecion;

    public SchedulerSectionDTO(Long id, String text, List<SchedulerEventDTO> events, Section originalSecion) {
        this.id = id;
        this.text = text;
        this.events = events;
        this.originalSecion = originalSecion;
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

    public Section getOriginalSecion() {
        return originalSecion;
    }

    public void setOriginalSecion(Section originalSecion) {
        this.originalSecion = originalSecion;
    }
}
