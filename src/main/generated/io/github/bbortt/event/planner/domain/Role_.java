package io.github.bbortt.event.planner.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Role.class)
public abstract class Role_ {
    public static volatile SetAttribute<Role, Invitation> invitations;
    public static volatile SingularAttribute<Role, String> name;

    public static final String INVITATIONS = "invitations";
    public static final String NAME = "name";
}
