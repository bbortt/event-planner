package io.github.bbortt.event.planner.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ForbiddenRequestException extends RuntimeException {

    public ForbiddenRequestException(String message) {
        super(message);
    }
}
