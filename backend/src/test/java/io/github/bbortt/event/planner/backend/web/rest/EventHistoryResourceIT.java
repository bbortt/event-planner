package io.github.bbortt.event.planner.backend.web.rest;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistory;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.domain.Project;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.repository.EventHistoryRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.EntityManager;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventHistoryResource} REST controller.
 */
public class EventHistoryResourceIT extends AbstractApplicationContextAwareIT {

    private static final String TEST_USER_LOGIN = "eventresourceit-login";

    private static final EventHistoryAction DEFAULT_ACTION = EventHistoryAction.CREATE;
    private static final EventHistoryAction UPDATE_ACTION = EventHistoryAction.UPDATE;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String CREATED_BY = "created-by";
    private static final String UPDATED_BY = "updated-by";

    private static final ZonedDateTime CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(1L), ZoneOffset.UTC);

    @Autowired
    private EventHistoryRepository eventHistoryRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventMockMvc;

    private Project project;
    private Map<String, Object> userDetails;
    private EventHistory eventHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static EventHistory createEntity(EntityManager em) {
        EventHistory eventHistory = new EventHistory()
            .action(DEFAULT_ACTION)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME)
            .createdBy(CREATED_BY)
            .createdDate(CREATED_DATE);

        Event event;
        if (TestUtil.findAll(em, Event.class).isEmpty()) {
            event = EventResourceIT.createEntity(em);
            em.persist(event);
            em.flush();
        } else {
            event = TestUtil.findAll(em, Event.class).get(0);
        }
        eventHistory.setEvent(event);

        Section section;
        if (TestUtil.findAll(em, Section.class).isEmpty()) {
            section = SectionResourceIT.createEntity(em);
            em.persist(section);
            em.flush();
        } else {
            section = TestUtil.findAll(em, Section.class).get(0);
        }
        eventHistory.setSection(section);

        return eventHistory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static EventHistory createUpdatedEntity(EntityManager em) {
        EventHistory eventHistory = new EventHistory()
            .action(UPDATE_ACTION)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .createdBy(UPDATED_BY)
            .createdDate(UPDATED_DATE);

        Event event;
        if (TestUtil.findAll(em, Event.class).isEmpty()) {
            event = EventResourceIT.createEntity(em);
            em.persist(event);
            em.flush();
        } else {
            event = TestUtil.findAll(em, Event.class).get(0);
        }
        eventHistory.setEvent(event);

        Section section;
        if (TestUtil.findAll(em, Section.class).isEmpty()) {
            section = SectionResourceIT.createEntity(em);
            em.persist(section);
            em.flush();
        } else {
            section = TestUtil.findAll(em, Section.class).get(0);
        }
        eventHistory.setSection(section);

        return eventHistory;
    }

    @BeforeEach
    void initTest() {
        userDetails = new HashMap<>();
        userDetails.put("sub", TEST_USER_LOGIN);
        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        project = ProjectResourceIT.createEntity(em);
        em.persist(project);

        eventHistory = createEntity(em);
        eventHistory.project(project);

        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(project)
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleContributor());
        em.persist(invitation);

        em.flush();
    }

    @Test
    @Transactional
    void getAllEventHistory() throws Exception {
        TestSecurityContextHolder.setAuthentication(
            TestUtil.createMockOAuth2AuthenticationToken(
                userDetails,
                Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN))
            )
        );

        // Initialize the database
        eventHistoryRepository.saveAndFlush(eventHistory);

        // Get all the eventList
        restEventMockMvc
            .perform(get("/api/events/history/projects/{projectId}?sort=id,desc", eventHistory.getProjectId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].startTime").value(Matchers.hasItem(TestUtil.sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(Matchers.hasItem(TestUtil.sameInstant(DEFAULT_END_TIME))));
    }

    @Test
    @Transactional
    void getAllEventHistoryForbiddenForUsers() throws Exception {
        // Initialize the database
        eventHistoryRepository.saveAndFlush(eventHistory);

        // Get all the sectionList
        restEventMockMvc
            .perform(get("/api/events/history/projects/{projectId}?sort=id,desc", eventHistory.getProjectId()))
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    void getPartialEventHistorySince() throws Exception {
        TestSecurityContextHolder.setAuthentication(
            TestUtil.createMockOAuth2AuthenticationToken(
                userDetails,
                Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN))
            )
        );

        // Initialize the database
        eventHistoryRepository.saveAndFlush(eventHistory);

        EventHistory latestEventHistory = createEntity(em)
            .project(project)
            .createdDate(ZonedDateTime.ofInstant(Instant.ofEpochMilli(2L), ZoneOffset.UTC));
        eventHistoryRepository.saveAndFlush(latestEventHistory);

        // Get a partial eventList
        restEventMockMvc
            .perform(
                get(
                    "/api/events/history/projects/{projectId}?sort=id,desc&since={}",
                    eventHistory.getProjectId(),
                    ZonedDateTime.ofInstant(Instant.ofEpochMilli(2L), ZoneOffset.UTC)
                )
            )
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(latestEventHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].startTime").value(Matchers.hasItem(TestUtil.sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(Matchers.hasItem(TestUtil.sameInstant(DEFAULT_END_TIME))));
    }

    @Test
    @Transactional
    void getEventHistoryEntry() throws Exception {
        TestSecurityContextHolder.setAuthentication(
            TestUtil.createMockOAuth2AuthenticationToken(
                userDetails,
                Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN))
            )
        );

        // Initialize the database
        eventHistoryRepository.saveAndFlush(eventHistory);

        // Get the event
        restEventMockMvc
            .perform(get("/api/events/history/{id}", eventHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventHistory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.startTime").value(TestUtil.sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(TestUtil.sameInstant(DEFAULT_END_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingEventHistoryEntry() throws Exception {
        TestSecurityContextHolder.setAuthentication(
            TestUtil.createMockOAuth2AuthenticationToken(
                userDetails,
                Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN))
            )
        );

        // Get the event
        restEventMockMvc.perform(get("/api/events/history/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }
}
