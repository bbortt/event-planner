package io.github.bbortt.event.planner.domain;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

@Table
@Entity
public class Project extends AbstractAuditingEntity {

  @Id
  @Column(nullable = false, updatable = false)
  @GenericGenerator(
    name = "project_id_seq",
    strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
    parameters = { @Parameter(name = "sequence_name", value = "project_id_seq"), @Parameter(name = "increment_size", value = "1") }
  )
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_id_seq")
  private Long id;

  @NotNull
  @Size(min = 36, max = 36)
  @Column(columnDefinition = "bpchar(36)", nullable = false, updatable = false)
  private UUID token = UUID.randomUUID();

  @NotNull
  @Size(min = 1, max = 50)
  @Column(length = 50, nullable = false)
  private String name;

  @Size(min = 1, max = 300)
  @Column(length = 300)
  private String description;

  @NotNull
  @Column(nullable = false, updatable = false)
  private ZonedDateTime startTime;

  @NotNull
  @Column(nullable = false, updatable = false)
  private ZonedDateTime endTime;

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;

  @OneToMany(mappedBy = "project")
  private Set<Member> members = new HashSet<>();

  @OneToMany(mappedBy = "project")
  private Set<Locality> localities = new HashSet<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UUID getToken() {
    return token;
  }

  public void setToken(UUID token) {
    this.token = token;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public ZonedDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(ZonedDateTime startTime) {
    this.startTime = startTime;
  }

  public ZonedDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(ZonedDateTime endTime) {
    this.endTime = endTime;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Set<Member> getMembers() {
    return members;
  }

  public void setMembers(Set<Member> members) {
    this.members = members;
  }

  public Set<Locality> getLocalities() {
    return localities;
  }

  public void setLocalities(Set<Locality> localities) {
    this.localities = localities;
  }
}
