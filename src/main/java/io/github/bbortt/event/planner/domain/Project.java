package io.github.bbortt.event.planner.domain;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.NaturalId;
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
  @NaturalId
  @Column(columnDefinition = "BPCHAR(36)", nullable = false, updatable = false)
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
  private LocalDate startDate;

  @NotNull
  @Column(nullable = false, updatable = false)
  private LocalDate endDate;

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;

  @OneToMany(mappedBy = "project", cascade = { CascadeType.ALL })
  private Set<Member> members = new HashSet<>();

  @OneToMany(mappedBy = "project")
  private Set<Locality> localities = new HashSet<>();

  public Project() {
    // Empty project
  }

  public Project(String name, LocalDate startDate, LocalDate endDate) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public Long getId() {
    return id;
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

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public LocalDate getEndDate() {
    return endDate;
  }

  public void setEndDate(LocalDate endDate) {
    this.endDate = endDate;
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Project project = (Project) o;

    return new EqualsBuilder().append(getToken(), project.getToken()).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(getToken()).toHashCode();
  }
}
