package io.github.bbortt.event.planner.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Invitation.class)
public abstract class Invitation_ {

    public static volatile SingularAttribute<Invitation, Role> role;
    public static volatile SingularAttribute<Invitation, Responsibility> responsibility;
    public static volatile SingularAttribute<Invitation, Boolean> accepted;
    public static volatile SingularAttribute<Invitation, Project> project;
    public static volatile SingularAttribute<Invitation, Long> id;
    public static volatile SingularAttribute<Invitation, User> user;
    public static volatile SingularAttribute<Invitation, String> email;

    public static final String ROLE = "role";
    public static final String RESPONSIBILITY = "responsibility";
    public static final String ACCEPTED = "accepted";
    public static final String PROJECT = "project";
    public static final String ID = "id";
    public static final String USER = "user";
    public static final String EMAIL = "email";
}
