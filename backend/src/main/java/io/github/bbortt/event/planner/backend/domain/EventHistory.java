package io.github.bbortt.event.planner.backend.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

@Entity
@Table(name = "event_history")
public class EventHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(
        name = "event_history_id_seq",
        strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
        parameters = {
            @Parameter(name = "sequence_name", value = "event_history_id_seq"), @Parameter(name = "increment_size", value = "1"),
        }
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_history_id_seq")
    private Long id;

    @Column(name = "event_id", nullable = false, updatable = false)
    private Long eventId;

    @Column(name = "project_id", nullable = false, updatable = false)
    private Long projectId;

    @Column(name = "action", columnDefinition = "bpchar(6)", nullable = false, updatable = false)
    private EventHistoryAction action;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "name", length = 50, nullable = false, updatable = false)
    private String name;

    @Size(max = 300)
    @Column(name = "description", length = 300, updatable = false)
    private String description;

    @NotNull
    @Column(name = "start_time", nullable = false, updatable = false)
    private ZonedDateTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false, updatable = false)
    private ZonedDateTime endTime;

    @Column(name = "section_id", updatable = false)
    private Long sectionId;

    @Column(name = "responsibility_id", updatable = false)
    private Long responsibilityId;

    @Size(max = 100)
    @Column(name = "jhi_user_id", updatable = false)
    private String jhiUserId;

    @Column(name = "created_by", length = 50, nullable = false, updatable = false)
    private String createdBy;

    @Column(name = "created_date", updatable = false)
    private ZonedDateTime createdDate = ZonedDateTime.now();

    public Long getId() {
        return id;
    }

    public EventHistory id(Long id) {
        this.id = id;
        return this;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEvent(Event event) {
        this.eventId = event.getId();
    }

    public EventHistory event(Event event) {
        this.eventId = event.getId();
        return this;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProject(Project project) {
        this.projectId = project.getId();
    }

    public EventHistory project(Project project) {
        this.projectId = project.getId();
        return this;
    }

    public EventHistoryAction getAction() {
        return action;
    }

    public void setAction(EventHistoryAction action) {
        this.action = action;
    }

    public EventHistory action(EventHistoryAction action) {
        this.action = action;
        return this;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EventHistory name(String name) {
        this.name = name;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public EventHistory description(String description) {
        this.description = description;
        return this;
    }

    public ZonedDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public EventHistory startTime(ZonedDateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public ZonedDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public EventHistory endTime(ZonedDateTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public Long getSectionId() {
        return sectionId;
    }

    public void setSection(Section section) {
        this.sectionId = section.getId();
    }

    public EventHistory section(Section section) {
        this.sectionId = section.getId();
        return this;
    }

    public Long getResponsibilityId() {
        return responsibilityId;
    }

    public void setResponsibility(Responsibility responsibility) {
        this.responsibilityId = responsibility.getId();
    }

    public EventHistory responsibility(Responsibility responsibility) {
        this.responsibilityId = responsibility.getId();
        return this;
    }

    public String getJhiUserId() {
        return jhiUserId;
    }

    public void setJhiUserId(String jhiUserId) {
        this.jhiUserId = jhiUserId;
    }

    public EventHistory jhiUserId(String jhiUserId) {
        this.jhiUserId = jhiUserId;
        return this;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public EventHistory createdBy(String createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public EventHistory createdDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventHistory)) {
            return false;
        }
        return id != null && id.equals(((EventHistory) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventHistory{" +
            "id='" + getId() + "'" +
            ", eventId='" + getEventId() + "'" +
            ", action='" + getAction() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", jhiUserId='" + getJhiUserId() + "'" +
            "}";
    }
}
