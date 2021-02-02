package io.github.bbortt.event.planner.service.dto.scheduler;

import io.github.bbortt.event.planner.domain.Event;
import java.time.ZonedDateTime;

public class SchedulerEventDTO {

    private String text;
    private String description;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private Long sectionId;
    private String colorGroupId;
    private Event originalEvent;

    public SchedulerEventDTO(
        String text,
        String description,
        ZonedDateTime startDate,
        ZonedDateTime endDate,
        Long sectionId,
        String colorGroupId,
        Event originalEvent
    ) {
        this.text = text;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sectionId = sectionId;
        this.colorGroupId = colorGroupId;
        this.originalEvent = originalEvent;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    public ZonedDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate;
    }

    public Long getSectionId() {
        return sectionId;
    }

    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }

    public String getColorGroupId() {
        return colorGroupId;
    }

    public void setColorGroupId(String colorGroupId) {
        this.colorGroupId = colorGroupId;
    }

    public Event getOriginalEvent() {
        return originalEvent;
    }

    public void setOriginalEvent(Event originalEvent) {
        this.originalEvent = originalEvent;
    }
}
