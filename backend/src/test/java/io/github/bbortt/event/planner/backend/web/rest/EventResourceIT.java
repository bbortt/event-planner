package io.github.bbortt.event.planner.backend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.bbortt.event.planner.backend.AbstractApplicationContextAwareIT;
import io.github.bbortt.event.planner.backend.domain.Event;
import io.github.bbortt.event.planner.backend.domain.EventHistory;
import io.github.bbortt.event.planner.backend.domain.EventHistoryAction;
import io.github.bbortt.event.planner.backend.domain.Invitation;
import io.github.bbortt.event.planner.backend.domain.Section;
import io.github.bbortt.event.planner.backend.event.EventHistoryEvent;
import io.github.bbortt.event.planner.backend.event.listener.EventHistoryEventListener;
import io.github.bbortt.event.planner.backend.repository.EventHistoryRepository;
import io.github.bbortt.event.planner.backend.repository.EventRepository;
import io.github.bbortt.event.planner.backend.repository.RoleRepository;
import io.github.bbortt.event.planner.backend.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.backend.service.EventHistoryService;
import io.github.bbortt.event.planner.backend.service.EventService;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventResource} REST controller.
 */
class EventResourceIT extends AbstractApplicationContextAwareIT {

    private static final String TEST_USER_LOGIN = "eventresourceit-login";
    private static final String TEST_ADMIN_LOGIN = "eventresourceit-admin";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventHistoryRepository eventHistoryRepository;

    @Autowired
    private EventService eventService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventMockMvc;

    @MockBean
    private EventHistoryEventListener eventHistoryEventListener;

    private Map<String, Object> userDetails;
    private Event event;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Event createEntity(EntityManager em) {
        Event event = new Event()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME);

        Section section;
        if (TestUtil.findAll(em, Section.class).isEmpty()) {
            section = SectionResourceIT.createEntity(em);
            em.persist(section);
            em.flush();
        } else {
            section = TestUtil.findAll(em, Section.class).get(0);
        }
        event.setSection(section);

        return event;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if they test an entity which requires the current entity.
     */
    public static Event createUpdatedEntity(EntityManager em) {
        Event event = new Event()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME);

        Section section;
        if (TestUtil.findAll(em, Section.class).isEmpty()) {
            section = SectionResourceIT.createEntity(em);
            em.persist(section);
            em.flush();
        } else {
            section = TestUtil.findAll(em, Section.class).get(0);
        }
        event.setSection(section);

        return event;
    }

    @BeforeEach
    void initTest() {
        userDetails = new HashMap<>();
        userDetails.put("sub", TEST_USER_LOGIN);
        TestSecurityContextHolder.setAuthentication(TestUtil.createMockOAuth2AuthenticationToken(userDetails));

        event = createEntity(em);

        Invitation invitation = InvitationResourceIT
            .createEntity(em)
            .accepted(Boolean.TRUE)
            .project(event.getSection().getLocation().getProject())
            .jhiUserId(TEST_USER_LOGIN)
            .role(roleRepository.roleContributor());
        em.persist(invitation);

        em.flush();
    }

    @Test
    @Transactional
    void createEvent() throws Exception {
        eventRepository.deleteAll();
        eventHistoryRepository.deleteAll();

        // Create the Event
        restEventMockMvc
            .perform(post("/api/events").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isCreated());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(1);
        Event testEvent = eventList.get(0);
        assertThat(testEvent.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEvent.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testEvent.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testEvent.getEndTime()).isEqualTo(DEFAULT_END_TIME);

        ArgumentCaptor<EventHistoryEvent> captor = ArgumentCaptor.forClass(EventHistoryEvent.class);
        verify(eventHistoryEventListener).eventHistoryEvent(captor.capture());

        EventHistoryEvent eventHistoryEvent = captor.getValue();
        assertThat(eventHistoryEvent.getEvent()).isEqualTo(testEvent);
        assertThat(eventHistoryEvent.getAction()).isEqualTo(EventHistoryAction.CREATE);
    }

    @Test
    @Transactional
    void createEventWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventRepository.findAll().size();

        // Create the Event with an existing ID
        event.id(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventMockMvc
            .perform(post("/api/events").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setName(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post("/api/events").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setStartTime(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post("/api/events").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setEndTime(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post("/api/events").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEvents() throws Exception {
        TestSecurityContextHolder.setAuthentication(
            TestUtil.createMockOAuth2AuthenticationToken(
                userDetails,
                Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN))
            )
        );

        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get all the eventList
        restEventMockMvc
            .perform(get("/api/events?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(event.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].startTime").value(Matchers.hasItem(TestUtil.sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(Matchers.hasItem(TestUtil.sameInstant(DEFAULT_END_TIME))));
    }

    @Test
    @Transactional
    void getAllEventsForbiddenForUsers() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get all the sectionList
        restEventMockMvc.perform(get("/api/events?sort=id,desc")).andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    void getEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get the event
        restEventMockMvc
            .perform(get("/api/events/{id}", event.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(event.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.startTime").value(TestUtil.sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(TestUtil.sameInstant(DEFAULT_END_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingEvent() throws Exception {
        // Get the event
        restEventMockMvc.perform(get("/api/events/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void updateEvent() throws Exception {
        // Initialize the database
        eventService.save(event);

        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event
        Event updatedEvent = eventRepository.findById(event.getId()).get();
        // Disconnect from session so that the updates on updatedEvent are not directly saved in db
        em.detach(updatedEvent);
        updatedEvent.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restEventMockMvc
            .perform(put("/api/events").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedEvent)))
            .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = eventList
            .stream()
            .filter(event -> updatedEvent.getId().equals(event.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cannot find updated event!"));
        assertThat(testEvent.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEvent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEvent.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testEvent.getEndTime()).isEqualTo(UPDATED_END_TIME);

        ArgumentCaptor<EventHistoryEvent> captor = ArgumentCaptor.forClass(EventHistoryEvent.class);
        verify(eventHistoryEventListener, times(2)).eventHistoryEvent(captor.capture());

        EventHistoryEvent eventHistoryEvent = captor.getAllValues().get(1);
        assertThat(eventHistoryEvent.getEvent()).isEqualTo(event);
        assertThat(eventHistoryEvent.getAction()).isEqualTo(EventHistoryAction.UPDATE);
    }

    @Test
    @Transactional
    void updateNonExistingEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(put("/api/events").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEvent() throws Exception {
        // Initialize the database
        eventService.save(event);

        int databaseSizeBeforeDelete = eventRepository.findAll().size();

        // Delete the event
        restEventMockMvc
            .perform(delete("/api/events/{id}", event.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeDelete - 1);

        ArgumentCaptor<EventHistoryEvent> captor = ArgumentCaptor.forClass(EventHistoryEvent.class);
        verify(eventHistoryEventListener, times(2)).eventHistoryEvent(captor.capture());

        EventHistoryEvent eventHistoryEvent = captor.getAllValues().get(1);
        assertThat(eventHistoryEvent.getEvent()).isEqualTo(event);
        assertThat(eventHistoryEvent.getAction()).isEqualTo(EventHistoryAction.DELETE);
    }
}
