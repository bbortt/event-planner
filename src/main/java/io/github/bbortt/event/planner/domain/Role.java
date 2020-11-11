package io.github.bbortt.event.planner.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * A Role.
 */
@Entity
@Table(name = "role")
public class Role implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NotNull
    @Size(min = 1, max = 20)
    @Column(name = "name", length = 20, nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "role")
    private Set<Invitation> invitations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role name(String name) {
        this.name = name;
        return this;
    }

    public Set<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(Set<Invitation> invitations) {
        this.invitations = invitations;
    }

    public Role invitations(Set<Invitation> invitations) {
        this.invitations = invitations;
        return this;
    }

    public Role addInvitation(Invitation invitation) {
        this.invitations.add(invitation);
        invitation.setRole(this);
        return this;
    }

    public Role removeInvitation(Invitation invitation) {
        this.invitations.remove(invitation);
        invitation.setRole(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Role)) {
            return false;
        }
        return name != null && name.equals(((Role) o).name);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Role{" +
            "name='" + getName() + "'" +
            "}";
    }
}
