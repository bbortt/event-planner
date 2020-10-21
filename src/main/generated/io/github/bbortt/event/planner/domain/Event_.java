package io.github.bbortt.event.planner.domain;

import java.time.ZonedDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Event.class)
public abstract class Event_ {

    public static volatile SingularAttribute<Event, Responsibility> responsibility;
    public static volatile SingularAttribute<Event, String> name;
    public static volatile SingularAttribute<Event, String> description;
    public static volatile SingularAttribute<Event, ZonedDateTime> startTime;
    public static volatile SingularAttribute<Event, Long> id;
    public static volatile SingularAttribute<Event, ZonedDateTime> endTime;
    public static volatile SingularAttribute<Event, User> user;
    public static volatile SetAttribute<Event, Section> sections;

    public static final String RESPONSIBILITY = "responsibility";
    public static final String NAME = "name";
    public static final String DESCRIPTION = "description";
    public static final String START_TIME = "startTime";
    public static final String ID = "id";
    public static final String END_TIME = "endTime";
    public static final String USER = "user";
    public static final String SECTIONS = "sections";
}
