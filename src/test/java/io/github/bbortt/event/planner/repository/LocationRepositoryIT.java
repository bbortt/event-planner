package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.IntegrationTest;
import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.web.rest.LocationResourceIT;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@IntegrationTest
class LocationRepositoryIT {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private LocationRepository locationRepository;

    private Location location;
    private Location nestingLevel1;
    private Location nestingLevel2;

    @BeforeEach
    void beforeEachSetup() {
        nestingLevel2 = LocationResourceIT.createEntity(entityManager);
        nestingLevel1 = LocationResourceIT.createEntity(entityManager).withChild(nestingLevel2);
        location = LocationResourceIT.createEntity(entityManager).withChild(nestingLevel1);

        entityManager.persist(location);
    }

    @Test
    @Transactional
    void findAllByParentIsNullAndProject_IdEquals() {
        List<Location> result = locationRepository.findAllByParentIsNullAndProject_IdEquals(location.getProject().getId());

        assertEquals(1, result.size());
        assertEquals(location, result.get(0));
        assertEquals(1, result.get(0).getChildren().size());

        Location nestedResult = result.get(0).getChildren().iterator().next();
        assertEquals(nestingLevel1, nestedResult);
        assertEquals(1, nestedResult.getChildren().size());

        Location nestedNestedResult = nestedResult.getChildren().iterator().next();
        assertEquals(nestingLevel2, nestedNestedResult);
        assertEquals(0, nestedNestedResult.getChildren().size());
    }
}
