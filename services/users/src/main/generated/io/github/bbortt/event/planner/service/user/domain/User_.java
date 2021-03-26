package io.github.bbortt.event.planner.service.user.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ extends io.github.bbortt.event.planner.service.user.domain.AbstractAuditingEntity_ {

	public static volatile SingularAttribute<User, String> firstName;
	public static volatile SingularAttribute<User, String> lastName;
	public static volatile SingularAttribute<User, String> langKey;
	public static volatile SingularAttribute<User, String> imageUrl;
	public static volatile SingularAttribute<User, String> id;
	public static volatile SingularAttribute<User, String> login;
	public static volatile SingularAttribute<User, String> email;
	public static volatile SetAttribute<User, Authority> authorities;
	public static volatile SingularAttribute<User, Boolean> activated;

	public static final String FIRST_NAME = "firstName";
	public static final String LAST_NAME = "lastName";
	public static final String LANG_KEY = "langKey";
	public static final String IMAGE_URL = "imageUrl";
	public static final String ID = "id";
	public static final String LOGIN = "login";
	public static final String EMAIL = "email";
	public static final String AUTHORITIES = "authorities";
	public static final String ACTIVATED = "activated";

}

