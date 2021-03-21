package io.github.bbortt.event.planner.backend.service.dto.scheduler;

import io.github.bbortt.event.planner.backend.domain.Section;

public class SchedulerSectionDTO {
    private Long id;
    private String text;
    private Section originalSection;

    public SchedulerSectionDTO(Long id, String text, Section originalSection) {
        this.id = id;
        this.text = text;
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

    public Section getOriginalSection() {
        return originalSection;
    }

    public void setOriginalSection(Section originalSection) {
        this.originalSection = originalSection;
    }
}
