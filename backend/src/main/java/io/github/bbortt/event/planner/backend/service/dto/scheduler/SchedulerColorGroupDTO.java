package io.github.bbortt.event.planner.backend.service.dto.scheduler;

public class SchedulerColorGroupDTO {

    private String id;
    private String color;

    public SchedulerColorGroupDTO(String id, String color) {
        this.id = id;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
