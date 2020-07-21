package io.github.bbortt.event.planner.domain;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

/**
 * A Responsibility.
 */
@Entity
@Table(name = "responsibility")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Responsibility implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(
        name = "responsibility_id_seq",
        strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
        parameters = {
            @Parameter(name = "sequence_name", value = "responsibility_id_seq"), @Parameter(name = "increment_size", value = "1"),
        }
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "responsibility_id_seq")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Responsibility name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Responsibility)) {
            return false;
        }
        return id != null && id.equals(((Responsibility) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Responsibility{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
