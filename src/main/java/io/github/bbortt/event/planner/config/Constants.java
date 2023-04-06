package io.github.bbortt.event.planner.config;

/**
 * Application constants.
 */
public final class Constants {

    // Regex for acceptable logins
    public static final String LOGIN_REGEX = "^(?>[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*)|(?>[_.@A-Za-z0-9-]+)$";

    public static final String SYSTEM = "system";
    public static final String DEFAULT_LANGUAGE = "de";

    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final String DEFAULT_SORT_DIRECTION_SPLIT = ",";
    public static final String SLICE_HAS_NEXT_PAGE_HEADER = "Has-Next-Page";

    public static final String SPRING_PROFILE_MAIL = "mail";

    private Constants() {}
}
