package io.github.bbortt.event.planner.web.rest.util;

import static io.github.bbortt.event.planner.config.Constants.SLICE_HAS_NEXT_PAGE_HEADER;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpHeaders;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Infinity scroll with {@link Slice}. <a href="https://www.jhipster.tech/tips/019_tip_infinite_scroll_with_slice.html">Source</a>.
 */
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
    public static <T> HttpHeaders generatePaginationHttpHeaders(UriComponentsBuilder uriBuilder, Page<T> page) {
        return tech.jhipster.web.util.PaginationUtil.generatePaginationHttpHeaders(uriBuilder, page);
    }

    public static HttpHeaders generateSliceHttpHeaders(Slice<?> slice) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(SLICE_HAS_NEXT_PAGE_HEADER, "" + slice.hasNext());
        return headers;
    }
}
