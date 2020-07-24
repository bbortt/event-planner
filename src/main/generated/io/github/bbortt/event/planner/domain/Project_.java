package io.github.bbortt.event.planner.domain;

import java.time.ZonedDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Project.class)
public abstract class Project_ {
    public static volatile SetAttribute<Project, Responsibility> responsibilities;
    public static volatile SingularAttribute<Project, String> name;
    public static volatile SingularAttribute<Project, String> description;
    public static volatile SingularAttribute<Project, ZonedDateTime> startTime;
    public static volatile SingularAttribute<Project, Long> id;
    public static volatile SingularAttribute<Project, ZonedDateTime> endTime;

    public static final String RESPONSIBILITIES = "responsibilities";
    public static final String NAME = "name";
    public static final String DESCRIPTION = "description";
    public static final String START_TIME = "startTime";
    public static final String ID = "id";
    public static final String END_TIME = "endTime";
}
