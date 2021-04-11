package io.github.bbortt.event.planner.gateway.web.filter;

import io.github.bbortt.event.planner.gateway.security.SecurityUtils;
import io.github.bbortt.event.planner.gateway.service.UserService;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class PublishUserInformationFilter implements WebFilter {

    private static final String USER_INFO_PUBLISHED_IN_SESSION = "user-info-published";

    private final UserService userService;

    public PublishUserInformationFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        if (!exchange.getRequest().getURI().getPath().equals("/api/account")) {
            return chain.filter(exchange);
        }

        return SecurityUtils
            .isAuthenticated()
            .filter(isAuthenticated -> isAuthenticated)
            .flatMap(isAuthenticated -> exchange.getSession())
            .filter(webSession -> !webSession.getAttributeOrDefault(USER_INFO_PUBLISHED_IN_SESSION, false))
            .flatMap(webSession -> SecurityUtils.getCurrentAuthenticationToken())
            .filter(authenticationToken -> AbstractAuthenticationToken.class.isAssignableFrom(authenticationToken.getClass()))
            .map(authenticationMono -> ((AbstractAuthenticationToken) authenticationMono))
            .flatMap(userService::getUserFromAuthentication)
            .doOnNext(userService::publishUserInformation)
            .doOnNext(
                userDTO ->
                    exchange
                        .getSession()
                        .map(
                            webSession -> {
                                webSession.getAttributes().put(USER_INFO_PUBLISHED_IN_SESSION, true);
                                return webSession;
                            }
                        )
            )
            .then(chain.filter(exchange));
    }
}
