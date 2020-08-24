package io.github.bbortt.event.planner.domain;

import java.time.ZonedDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Location.class)
public abstract class Location_ {
    public static volatile SingularAttribute<Location, Responsibility> responsibility;
    public static volatile SingularAttribute<Location, String> name;
    public static volatile SingularAttribute<Location, ZonedDateTime> dateTo;
    public static volatile SingularAttribute<Location, Project> project;
    public static volatile SingularAttribute<Location, Long> id;
    public static volatile SingularAttribute<Location, ZonedDateTime> dateFrom;
    public static volatile SetAttribute<Location, Section> sections;

    public static final String RESPONSIBILITY = "responsibility";
    public static final String NAME = "name";
    public static final String DATE_TO = "dateTo";
    public static final String PROJECT = "project";
    public static final String ID = "id";
    public static final String DATE_FROM = "dateFrom";
    public static final String SECTIONS = "sections";
}
