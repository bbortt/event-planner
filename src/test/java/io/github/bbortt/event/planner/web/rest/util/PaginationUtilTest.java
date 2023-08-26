package io.github.bbortt.event.planner.web.rest.util;

import static io.github.bbortt.event.planner.config.Constants.DEFAULT_PAGE_SIZE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

class PaginationUtilTest {

    private final String defaultSorgingPropertyName = "test-default-sorting";

    private PaginationUtil fixture;

    @BeforeEach
    void beforeEachSetup() {
        fixture = new PaginationUtil();
    }

    @Test
    void createDefaultPagingInformation() {
        Pageable pageable = fixture.createPagingInformation(
            Optional.empty(),
            Optional.empty(),
            Optional.empty(),
            defaultSorgingPropertyName
        );

        assertEquals(DEFAULT_PAGE_SIZE, pageable.getPageSize());
        assertEquals(0, pageable.getPageNumber());
        assertEquals(0, pageable.getOffset());
        assertEquals(Sort.by(Sort.Order.desc(defaultSorgingPropertyName)), pageable.getSort());
    }

    @Test
    void createPagingInformationWithPageSize() {
        Integer pageSize = 33;

        Pageable pageable = fixture.createPagingInformation(
            Optional.of(pageSize),
            Optional.empty(),
            Optional.empty(),
            defaultSorgingPropertyName
        );

        assertEquals(pageSize, pageable.getPageSize());
        assertEquals(0, pageable.getPageNumber());
        assertEquals(0, pageable.getOffset());
        assertEquals(Sort.by(Sort.Order.desc(defaultSorgingPropertyName)), pageable.getSort());
    }

    @Test
    void createPagingInformationWithPageNumber() {
        int pageNumber = 33;

        Pageable pageable = fixture.createPagingInformation(
            Optional.empty(),
            Optional.of(pageNumber),
            Optional.empty(),
            defaultSorgingPropertyName
        );

        assertEquals(DEFAULT_PAGE_SIZE, pageable.getPageSize());
        // Note: The page number ist a zero based index
        assertEquals(pageNumber - 1, pageable.getPageNumber());
        assertEquals((pageNumber - 1) * DEFAULT_PAGE_SIZE, pageable.getOffset());
        assertEquals(Sort.by(Sort.Order.desc(defaultSorgingPropertyName)), pageable.getSort());
    }

    @Test
    void createPagingInformationWith0BasedPageNumber() {
        Optional<Integer> pageSize = Optional.empty();
        Optional<Integer> pageNumber = Optional.of(0);
        Optional<List<String>> sort = Optional.empty();

        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> fixture.createPagingInformation(pageSize, pageNumber, sort, defaultSorgingPropertyName)
        );

        assertEquals("Page number is 1-based!", exception.getMessage());
    }

    @Test
    void createPagingInformationWithNegativePageNumber() {
        Optional<Integer> pageSize = Optional.empty();
        Optional<Integer> pageNumber = Optional.of(-1);
        Optional<List<String>> sort = Optional.empty();

        Pageable pageable = fixture.createPagingInformation(pageSize, pageNumber, sort, defaultSorgingPropertyName);

        assertFalse(pageable.isPaged());
    }

    @Test
    void createPagingInformationWithSingleSort() {
        String sortProperty = "sortProperty";
        List<String> sort = List.of(sortProperty, "asc");

        Pageable pageable = fixture.createPagingInformation(
            Optional.empty(),
            Optional.empty(),
            Optional.of(sort),
            defaultSorgingPropertyName
        );

        assertEquals(DEFAULT_PAGE_SIZE, pageable.getPageSize());
        assertEquals(0, pageable.getPageNumber());
        assertEquals(0, pageable.getOffset());
        assertEquals(Sort.by(Sort.Order.asc(sortProperty)), pageable.getSort());
    }

    @Test
    void createPagingInformationWithArraySort() {
        String sortProperty1 = "sortProperty1";
        String sortProperty2 = "sortProperty2";

        List<String> sort = List.of(sortProperty1 + ",asc", sortProperty2 + ",desc");

        Pageable pageable = fixture.createPagingInformation(
            Optional.empty(),
            Optional.empty(),
            Optional.of(sort),
            defaultSorgingPropertyName
        );

        assertEquals(DEFAULT_PAGE_SIZE, pageable.getPageSize());
        assertEquals(0, pageable.getPageNumber());
        assertEquals(0, pageable.getOffset());
        assertEquals(Sort.by(List.of(Sort.Order.asc(sortProperty1), Sort.Order.desc(sortProperty2))), pageable.getSort());
    }

    @Test
    void createPagingInformationWithInvalidSortingDirection() {
        String sortProperty = "sortProperty";
        String invalidDirection = "invalidDirection";

        List<String> sort = List.of(sortProperty, invalidDirection);

        Pageable pageable = fixture.createPagingInformation(
            Optional.empty(),
            Optional.empty(),
            Optional.of(sort),
            defaultSorgingPropertyName
        );

        assertEquals(DEFAULT_PAGE_SIZE, pageable.getPageSize());
        assertEquals(0, pageable.getPageNumber());
        assertEquals(0, pageable.getOffset());
        assertEquals(Sort.by(List.of(Sort.Order.desc(sortProperty), Sort.Order.desc(invalidDirection))), pageable.getSort());
    }
}
