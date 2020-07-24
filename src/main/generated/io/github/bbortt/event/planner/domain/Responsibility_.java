package io.github.bbortt.event.planner.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Responsibility.class)
public abstract class Responsibility_ {
    public static volatile SingularAttribute<Responsibility, String> name;
    public static volatile SingularAttribute<Responsibility, Project> project;
    public static volatile SingularAttribute<Responsibility, Long> id;

    public static final String NAME = "name";
    public static final String PROJECT = "project";
    public static final String ID = "id";
}
