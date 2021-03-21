package io.github.bbortt.event.planner.backend.web.rest.errors;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/exception-translator-test")
class ExceptionTranslatorTestController {

    @GetMapping("/concurrency-failure")
    void concurrencyFailure() {
        throw new ConcurrencyFailureException("test concurrency failure");
    }

    @PostMapping("/method-argument")
    void methodArgument(@Valid @RequestBody TestDTO testDTO) {
    }

    @GetMapping("/missing-servlet-request-part")
    void missingServletRequestPartException(@RequestPart String part) {
    }

    @GetMapping("/missing-servlet-request-parameter")
    void missingServletRequestParameterException(@RequestParam String param) {
    }

    @GetMapping("/access-denied")
    void accessdenied() {
        throw new AccessDeniedException("test access denied!");
    }

    @GetMapping("/unauthorized")
    void unauthorized() {
        throw new BadCredentialsException("test authentication failed!");
    }

    @GetMapping("/response-status")
    void exceptionWithResponseStatus() {
        throw new TestResponseStatusException();
    }

    @GetMapping("/internal-server-error")
    void internalServerError() {
        throw new RuntimeException();
    }

    static class TestDTO {

        @NotNull
        private String test;

        String getTest() {
            return test;
        }

        void setTest(String test) {
            this.test = test;
        }
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "test response status")
    @SuppressWarnings("serial")
    static class TestResponseStatusException extends RuntimeException {

    }
}
