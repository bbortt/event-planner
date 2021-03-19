package io.github.bbortt.event.planner.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import io.github.bbortt.event.planner.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.config.Constants;
import io.github.bbortt.event.planner.domain.User;
import io.github.bbortt.event.planner.repository.UserRepository;
import io.github.bbortt.event.planner.service.dto.UserDTO;
import io.github.jhipster.security.RandomUtil;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.auditing.AuditingHandler;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for {@link UserService}.
 */
class UserServiceIT extends AbstractApplicationContextAwareIT {

     static final String DEFAULT_LOGIN = "johndoe";
     static final String DEFAULT_EMAIL = "johndoe@localhost";
     static final String DEFAULT_FIRSTNAME = "john";
     static final String DEFAULT_LASTNAME = "doe";
     static final String DEFAULT_IMAGEURL = "http://placehold.it/50x50";
     static final String DEFAULT_LANGKEY = "dummy";

    @Autowired
     UserRepository userRepository;

    @Autowired
     UserService userService;

    @Autowired
     AuditingHandler auditingHandler;

    @Mock
     DateTimeProvider dateTimeProvider;

     User user;

    @BeforeEach
    void init() {
        user = new User();
        user.setId(DEFAULT_LOGIN);
        user.setLogin(DEFAULT_LOGIN);
        user.setActivated(true);
        user.setEmail(DEFAULT_EMAIL);
        user.setFirstName(DEFAULT_FIRSTNAME);
        user.setLastName(DEFAULT_LASTNAME);
        user.setImageUrl(DEFAULT_IMAGEURL);
        user.setLangKey(DEFAULT_LANGKEY);

        when(dateTimeProvider.getNow()).thenReturn(Optional.of(LocalDateTime.now()));
        auditingHandler.setDateTimeProvider(dateTimeProvider);
    }

    @Test
    @Transactional
    void assertThatAnonymousUserIsNotGet() {
        user.setLogin(Constants.ANONYMOUS_USER);
        if (!userRepository.findOneByLogin(Constants.ANONYMOUS_USER).isPresent()) {
            userRepository.saveAndFlush(user);
        }
        final PageRequest pageable = PageRequest.of(0, (int) userRepository.count());
        final Page<UserDTO> allManagedUsers = userService.getAllManagedUsers(pageable);
        assertThat(allManagedUsers.getContent().stream().noneMatch(user -> Constants.ANONYMOUS_USER.equals(user.getLogin()))).isTrue();
    }

    @Test
    @Transactional
    void assertThatFindUsersByEmailOrLoginContaining() {
        User user1 = new User();
        user1.setId("EinLogin");
        user1.setLogin("EinLogin");
        user1.setEmail("email@ein-login.ch");
        userRepository.save(user1);

        User user2 = new User();
        user2.setId("ZweiLogin");
        user2.setLogin("ZweiLogin");
        user2.setEmail("email@zwei-login.ch");
        userRepository.save(user2);

        String testLoginIgnoreCase = "NL";
        assertThat(userService.findByEmailOrLoginContaining(testLoginIgnoreCase)).hasSize(1);

        String testEmailIgnoreCase = "@ZWEI";
        assertThat(userService.findByEmailOrLoginContaining(testEmailIgnoreCase)).hasSize(1);

        String testDistinct = "login.ch";
        assertThat(userService.findByEmailOrLoginContaining(testDistinct)).hasSize(2);
    }
}
