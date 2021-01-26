package io.github.bbortt.event.planner.service.dto;

import io.github.bbortt.event.planner.domain.Event;
import java.time.ZonedDateTime;

public class SchedulerEventDTO {

    private String text;
    private String description;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private String colorId;
    private String color;
    private Long sectionId;
    private Event originalEvent;

    public SchedulerEventDTO(
        String text,
        String description,
        ZonedDateTime startDate,
        ZonedDateTime endDate,
        String colorId,
        String color,
        Long sectionId,
        Event originalEvent
    ) {
        this.text = text;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.colorId = colorId;
        this.color = color;
        this.sectionId = sectionId;
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getSectionId() {
        return sectionId;
    }

    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }

    public String getColorId() {
        return colorId;
    }

    public void setColorId(String colorId) {
        this.colorId = colorId;
    }

    public Event getOriginalEvent() {
        return originalEvent;
    }

    public void setOriginalEvent(Event originalEvent) {
        this.originalEvent = originalEvent;
    }
}
