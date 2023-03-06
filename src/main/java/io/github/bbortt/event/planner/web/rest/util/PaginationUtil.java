package io.github.bbortt.event.planner.web.rest.util;

import static io.github.bbortt.event.planner.config.Constants.*;

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
        pageNumber.ifPresent(pageRequest::withPage);
        sort
            .filter(Predicate.not(List::isEmpty))
            .ifPresentOrElse(s -> pageRequest.withSort(parseSort(s)), () -> Sort.by(defaultSortingPropertyName).descending());
        return pageRequest;
    }

    private Integer pageSizeOrDefault(Optional<Integer> pageSize) {
        return pageSize.filter(ps -> ps > 0).orElse(DEFAULT_PAGE_SIZE);
    }

    private Sort parseSort(List<String> sort) {
        List<Sort.Order> orders = sort.stream().map(this::parseOrder).filter(Optional::isPresent).map(Optional::get).toList();

        return Sort.by(orders);
    }

    private Optional<Sort.Order> parseOrder(String order) {
        String[] attributeAndDirection = order.split(DEFAULT_SORT_DIRECTION_SPLIT);
        switch (attributeAndDirection.length) {
            case 1:
                return Optional.of(Sort.Order.desc(attributeAndDirection[0]));
            case 2:
                if (attributeAndDirection[1].equals("asc")) {
                    return Optional.of(Sort.Order.asc(attributeAndDirection[0]));
                } else if (attributeAndDirection[1].equals("desc")) {
                    return Optional.of(Sort.Order.desc(attributeAndDirection[0]));
                } else {
                    throw new IllegalArgumentException(String.format("Invalid order '%s'!", order));
                }
            default:
                return Optional.empty();
        }
    }
}
