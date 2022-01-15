package io.github.bbortt.event.planner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

@Table
@Entity
public class Locality extends AbstractAuditingEntity {

  @Id
  @Column(nullable = false, updatable = false)
  @GenericGenerator(
    name = "locality_id_seq",
    strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
    parameters = { @Parameter(name = "sequence_name", value = "locality_id_seq"), @Parameter(name = "increment_size", value = "1") }
  )
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "locality_id_seq")
  private Long id;

  @NotNull
  @Size(min = 1, max = 50)
  @Column(length = 50, nullable = false)
  private String name;

  @Size(min = 1, max = 300)
  @Column(length = 300)
  private String description;

  @NotNull
  @ManyToOne(optional = false)
  @JoinColumn(name = "project_id", nullable = false, updatable = false)
  @JsonIgnoreProperties(value = "members", allowSetters = true)
  private Project project;

  @ManyToOne
  @JoinColumn(name = "locality_id", updatable = false)
  @JsonIgnoreProperties(value = "children", allowSetters = true)
  private Locality parent;

  @OneToMany(mappedBy = "parent", cascade = { CascadeType.REMOVE })
  private Set<Locality> children = new HashSet<>();

  public Locality() {
    // Empty Locality
  }

  public Locality(String name, Project project) {
    this.name = name;
    this.project = project;
  }

  public Long getId() {
    return id;
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

  public Project getProject() {
    return project;
  }

  public void setProject(Project project) {
    this.project = project;
  }

  public Locality getParent() {
    return parent;
  }

  public void setParent(Locality parent) {
    this.parent = parent;
  }

  public Set<Locality> getChildren() {
    return children;
  }

  public void setChildren(Set<Locality> children) {
    this.children = children;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Locality locality = (Locality) o;

    return new EqualsBuilder().append(getName(), locality.getName()).append(getProject(), locality.getProject()).isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37).append(getName()).append(getProject()).toHashCode();
  }
}
