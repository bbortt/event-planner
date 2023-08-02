package io.github.bbortt.event.planner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Event;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.web.rest.EventResourceIT;
import io.github.bbortt.event.planner.web.rest.LocationResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@IntegrationTest
class EventRepositoryIT {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private EventRepository eventRepository;

    private Project project;
    private Event event;

    @BeforeEach
    void beforeEachSetup() {
        project = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("17666d6a-0efb-4ba2-a0a0-f3888bc2f0d1"));
        entityManager.persist(project);

        Location location = LocationResourceIT.createEntity(entityManager).project(project);
        entityManager.persist(location);

        event = EventResourceIT.createEntity(entityManager).location(location);
        entityManager.persist(event);

        Project anotherProject = ProjectResourceIT
            .createEntity(entityManager)
            .token(UUID.fromString("04e76a7a-dfb5-4f1e-b965-1c8f32a2baf9"));
        entityManager.persist(anotherProject);

        Location anotherLocation = LocationResourceIT.createEntity(entityManager).project(anotherProject);
        entityManager.persist(anotherLocation);

        Event anotherEvent = EventResourceIT.createEntity(entityManager).location(anotherLocation);
        entityManager.persist(anotherEvent);
    }

    @Test
    @Transactional
    void findAllByLocation_Project_IdEquals() {
        Page<Event> result = eventRepository.findAllByLocation_Project_IdEquals(project.getId(), Pageable.ofSize(2));

        assertEquals(1, result.getContent().size());
        assertEquals(event, result.getContent().get(0));
    }
}
