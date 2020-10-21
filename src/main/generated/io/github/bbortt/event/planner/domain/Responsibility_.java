package io.github.bbortt.event.planner.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Responsibility.class)
public abstract class Responsibility_ {

    public static volatile SetAttribute<Responsibility, Invitation> invitations;
    public static volatile SingularAttribute<Responsibility, String> name;
    public static volatile SingularAttribute<Responsibility, Project> project;
    public static volatile SetAttribute<Responsibility, Location> locations;
    public static volatile SingularAttribute<Responsibility, Long> id;
    public static volatile SetAttribute<Responsibility, Event> events;

    public static final String INVITATIONS = "invitations";
    public static final String NAME = "name";
    public static final String PROJECT = "project";
    public static final String LOCATIONS = "locations";
    public static final String ID = "id";
    public static final String EVENTS = "events";
}
