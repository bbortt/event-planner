package io.github.bbortt.event.planner.domain;

import java.time.ZonedDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(LocationTimeSlot.class)
public abstract class LocationTimeSlot_ {

    public static volatile SingularAttribute<LocationTimeSlot, ZonedDateTime> startTime;
    public static volatile SingularAttribute<LocationTimeSlot, Location> location;
    public static volatile SingularAttribute<LocationTimeSlot, Long> id;
    public static volatile SingularAttribute<LocationTimeSlot, ZonedDateTime> endTime;

    public static final String START_TIME = "startTime";
    public static final String LOCATION = "location";
    public static final String ID = "id";
    public static final String END_TIME = "endTime";
}
