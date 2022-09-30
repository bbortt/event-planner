package io.github.bbortt.event.planner.apps.projects.domain.converter;

import java.util.List;

public interface DtoConverter<C, D> {
  C fromDto(D dto);

  D toDto(C clazz);

  List<C> fromDtos(List<D> dtos);

  List<D> toDtos(List<C> clazzes);
}
