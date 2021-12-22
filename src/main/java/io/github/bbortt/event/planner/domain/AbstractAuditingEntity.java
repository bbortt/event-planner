package io.github.bbortt.event.planner.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import org.springframework.boot.actuate.audit.listener.AuditListener;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

@MappedSuperclass
@EntityListeners(AuditListener.class)
public abstract class AbstractAuditingEntity {

  @JsonIgnore
  @CreatedBy
  @Column(nullable = false, length = 50, updatable = false)
  private String createdBy;

  @JsonIgnore
  @CreatedDate
  @Column(updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
  private Instant createdDate = Instant.now();

  @JsonIgnore
  @LastModifiedBy
  @Column(length = 50)
  private String lastModifiedBy;

  @JsonIgnore
  @LastModifiedDate
  @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")
  private Instant lastModifiedDate = Instant.now();

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public Instant getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Instant createdDate) {
    this.createdDate = createdDate;
  }

  public String getLastModifiedBy() {
    return lastModifiedBy;
  }

  public void setLastModifiedBy(String lastModifiedBy) {
    this.lastModifiedBy = lastModifiedBy;
  }

  public Instant getLastModifiedDate() {
    return lastModifiedDate;
  }

  public void setLastModifiedDate(Instant lastModifiedDate) {
    this.lastModifiedDate = lastModifiedDate;
  }
}
