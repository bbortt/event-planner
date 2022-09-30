package io.github.bbortt.event.planner.apps.projects.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;

class PaginationUtils {

  private static final int DEFAULT_PAGE_SIZE = 10;

  private static final String DEFAULT_SORT_SPLIT = ";";
  private static final String DEFAULT_SORT_DIRECTION_SPLIT = ",";

  private static Integer pageSizeOrDefault(Optional<Integer> pageSize) {
    return pageSize.filter(ps -> ps > 0).orElse(DEFAULT_PAGE_SIZE);
  }

  private static Sort parseSort(String sort) {
    List<Order> orders = Arrays
      .stream(sort.split(DEFAULT_SORT_SPLIT))
      .map(PaginationUtils::parseOrder)
      .filter(Optional::isPresent)
      .map(Optional::get)
      .toList();

    return Sort.by(orders);
  }

  private static Optional<Order> parseOrder(String order) {
    String[] attributeAndDirection = order.split(DEFAULT_SORT_DIRECTION_SPLIT);
    switch (attributeAndDirection.length) {
      case 1:
        return Optional.of(Order.desc(attributeAndDirection[0]));
      case 2:
        if (attributeAndDirection[1].equals("asc")) {
          return Optional.of(Order.asc(attributeAndDirection[0]));
        } else if (attributeAndDirection[1].equals("desc")) {
          return Optional.of(Order.desc(attributeAndDirection[0]));
        } else {
          throw new IllegalArgumentException(String.format("Invalid order '%s'!", order));
        }
      default:
        return Optional.empty();
    }
  }

  Pageable createPagingInformation(
    Optional<Integer> pageSize,
    Optional<Integer> pageNumber,
    Optional<String> sort,
    String defaultSortingPropertyName
  ) {
    PageRequest pageRequest = PageRequest.ofSize(pageSizeOrDefault(pageSize));
    pageNumber.ifPresent(pageRequest::withPage);
    sort
      .filter(StringUtils::isNotBlank)
      .ifPresentOrElse(s -> pageRequest.withSort(parseSort(s)), () -> Sort.by(defaultSortingPropertyName).descending());
    return pageRequest;
  }
}
