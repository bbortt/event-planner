package io.github.bbortt.event.planner.web.rest.errors;

import java.net.URI;
import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause;

@SuppressWarnings("java:S110") // Inheritance tree of classes should not be too deep
public class EntityNotFoundAlertException extends ErrorResponseException {

    private static final long serialVersionUID = 1L;

    private final String entityName;

    private final String errorKey;

    public EntityNotFoundAlertException(String defaultMessage, String entityName, String errorKey) {
        this(ErrorConstants.DEFAULT_TYPE, defaultMessage, entityName, errorKey);
    }

    public EntityNotFoundAlertException(URI type, String defaultMessage, String entityName, String errorKey) {
        super(
            HttpStatus.NOT_FOUND,
            ProblemDetailWithCause.ProblemDetailWithCauseBuilder
                .instance()
                .withStatus(HttpStatus.NOT_FOUND.value())
                .withType(type)
                .withTitle(defaultMessage)
                .withProperty("message", "error." + errorKey)
                .withProperty("params", entityName)
                .build(),
            null
        );
        this.entityName = entityName;
        this.errorKey = errorKey;
    }

    public String getEntityName() {
        return entityName;
    }

    public String getErrorKey() {
        return errorKey;
    }
}
