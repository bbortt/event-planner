package io.github.bbortt.event.planner.web.rest.util;

import static io.github.bbortt.event.planner.config.Constants.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import org.springframework.data.domain.*;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Infinity scroll with {@link Slice}. <a href="https://www.jhipster.tech/tips/019_tip_infinite_scroll_with_slice.html">Source</a>.
 */
@Component
public class PaginationUtil {

    private static final String ORDER_ASC_LITERAL = "asc";
    private static final String ORDER_DESC_LITERAL = "desc";

    private PaginationUtil() {}

    /**
     * Static reference to {@link tech.jhipster.web.util.PaginationUtil#generatePaginationHttpHeaders(UriComponentsBuilder, Page)}. Mimics an {@code extends tech.jhipster.web.util.PaginationUtil}.
     *
     * @param uriBuilder The URI builder.
     * @param page       The page.
     * @param <T>        The type of object.
     * @return http header.
     */
    public <T> HttpHeaders generatePaginationHttpHeaders(UriComponentsBuilder uriBuilder, Page<T> page) {
        return tech.jhipster.web.util.PaginationUtil.generatePaginationHttpHeaders(uriBuilder, page);
    }

    public HttpHeaders generateSliceHttpHeaders(Slice<?> slice) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(SLICE_HAS_NEXT_PAGE_HEADER, "" + slice.hasNext());
        return headers;
    }

    public Pageable createPagingInformation(
        Optional<Integer> pageSize,
        Optional<Integer> pageNumber,
        Optional<List<String>> sort,
        String defaultSortingPropertyName
    ) {
        PageRequest pageRequest = PageRequest.ofSize(pageSizeOrDefault(pageSize));

        if (pageNumber.isPresent()) {
            pageRequest = pageRequest.withPage(pageNumber.get());
        }

        return pageRequest.withSort(
            sort.filter(Predicate.not(List::isEmpty)).map(this::parseSort).orElseGet(() -> Sort.by(defaultSortingPropertyName).descending())
        );
    }

    private Integer pageSizeOrDefault(Optional<Integer> pageSize) {
        return pageSize.filter(ps -> ps > 0).orElse(DEFAULT_PAGE_SIZE);
    }

    private Sort parseSort(List<String> sort) {
        List<Sort.Order> orders = new ArrayList<>();

        for (int i = 0; i < sort.size(); i++) {
            if (sort.size() > i + 1 && isDirection(sort.get(i + 1))) {
                if (sort.get(i + 1).equals(ORDER_ASC_LITERAL)) {
                    orders.add(Sort.Order.asc(sort.get(i)));
                } else {
                    orders.add(Sort.Order.desc(sort.get(i)));
                }
                i++;
            } else {
                orders.add(Sort.Order.desc(sort.get(i)));
            }
        }

        return Sort.by(orders);
    }

    private boolean isDirection(String possibleDirection) {
        return ORDER_ASC_LITERAL.equals(possibleDirection) || ORDER_DESC_LITERAL.equals(possibleDirection);
    }
}
