package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.domain.Project;
import io.github.bbortt.event.planner.service.dto.LocationDTO;
import io.github.bbortt.event.planner.web.rest.LocationResourceIT;
import io.github.bbortt.event.planner.web.rest.ProjectResourceIT;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@IntegrationTest
@WithMockUser("location-service-it")
class LocationServiceIT {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private LocationService locationService;

    private Project project1;
    private Project project2;

    @BeforeEach
    void beforeEachSetup() {
        project1 = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("f9a04d43-8094-4b8e-ad32-2b89962a4cad"));
        entityManager.persist(project1);

        project2 = ProjectResourceIT.createEntity(entityManager).token(UUID.fromString("5cae8702-6cbc-4b44-a970-0beab74e0ba1"));
        entityManager.persist(project2);
    }

    @Test
    @Transactional
    void findInProjectReturnsLocationsInProject() {
        entityManager.persist(
            LocationResourceIT
                .createEntity(entityManager)
                .project(project1)
                .withChild(LocationResourceIT.createEntity(entityManager).project(project1))
        );
        entityManager.persist(
            LocationResourceIT
                .createEntity(entityManager)
                .project(project2)
                .withChild(LocationResourceIT.createEntity(entityManager).project(project2))
        );

        List<LocationDTO> locations = locationService.findAllInProject(project1.getId());

        assertEquals(1, locations.size());
        assertEquals(1, locations.get(0).getChildren().size());
    }

    @Test
    @Transactional
    void findAllInProjectExceptThisReturnsLocationsInProjectExceptMatchById() {
        Location validChild = LocationResourceIT.createEntity(entityManager).project(project1);
        entityManager.persist(validChild);

        Location excludedLocation = LocationResourceIT.createEntity(entityManager).project(project1);
        entityManager.persist(excludedLocation);

        entityManager.persist(
            LocationResourceIT.createEntity(entityManager).project(project1).withChild(validChild).withChild(excludedLocation)
        );

        List<LocationDTO> locations = locationService.findAllInProjectExceptThis(project1.getId(), excludedLocation.getId());

        assertEquals(1, locations.size());
        assertEquals(1, locations.get(0).getChildren().size());
    }
}
