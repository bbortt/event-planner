package io.github.bbortt.event.planner.mail;

import static org.springframework.web.context.request.RequestContextHolder.getRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import org.springframework.web.context.request.ServletRequestAttributes;

class ServletRequestUtil {

    Optional<HttpServletRequest> getCurrentHttpRequest() {
        return Optional
            .ofNullable(getRequestAttributes())
            .filter(ServletRequestAttributes.class::isInstance)
            .map(ServletRequestAttributes.class::cast)
            .map(ServletRequestAttributes::getRequest);
    }
}
