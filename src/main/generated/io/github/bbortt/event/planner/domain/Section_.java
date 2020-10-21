package io.github.bbortt.event.planner.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Section.class)
public abstract class Section_ {

    public static volatile SingularAttribute<Section, String> name;
    public static volatile SingularAttribute<Section, Location> location;
    public static volatile SingularAttribute<Section, Long> id;
    public static volatile SetAttribute<Section, Event> events;

    public static final String NAME = "name";
    public static final String LOCATION = "location";
    public static final String ID = "id";
    public static final String EVENTS = "events";
}
