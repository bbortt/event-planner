package io.github.bbortt.event.planner.domain;

import java.time.ZonedDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ extends io.github.bbortt.event.planner.domain.AbstractAuditingEntity_ {

    public static volatile SingularAttribute<User, String> lastName;
    public static volatile SingularAttribute<User, ZonedDateTime> resetDate;
    public static volatile SingularAttribute<User, String> login;
    public static volatile SingularAttribute<User, String> activationKey;
    public static volatile SingularAttribute<User, String> resetKey;
    public static volatile SetAttribute<User, Authority> authorities;
    public static volatile SingularAttribute<User, String> firstName;
    public static volatile SingularAttribute<User, String> password;
    public static volatile SingularAttribute<User, String> langKey;
    public static volatile SingularAttribute<User, String> imageUrl;
    public static volatile SingularAttribute<User, Long> id;
    public static volatile SingularAttribute<User, String> email;
    public static volatile SingularAttribute<User, Boolean> activated;

    public static final String LAST_NAME = "lastName";
    public static final String RESET_DATE = "resetDate";
    public static final String LOGIN = "login";
    public static final String ACTIVATION_KEY = "activationKey";
    public static final String RESET_KEY = "resetKey";
    public static final String AUTHORITIES = "authorities";
    public static final String FIRST_NAME = "firstName";
    public static final String PASSWORD = "password";
    public static final String LANG_KEY = "langKey";
    public static final String IMAGE_URL = "imageUrl";
    public static final String ID = "id";
    public static final String EMAIL = "email";
    public static final String ACTIVATED = "activated";
}
