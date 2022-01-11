package io.github.bbortt.event.planner.graphql.handler;

import graphql.ExceptionWhileDataFetching;
import graphql.GraphQLError;
import graphql.kickstart.execution.error.GraphQLErrorHandler;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class GraphQLExceptionHandler implements GraphQLErrorHandler {

  @Override
  public List<GraphQLError> processErrors(List<GraphQLError> list) {
    return list.stream().map(this::getNested).collect(Collectors.toList());
  }

  private GraphQLError getNested(GraphQLError error) {
    if (error instanceof ExceptionWhileDataFetching) {
      ExceptionWhileDataFetching exceptionError = (ExceptionWhileDataFetching) error;
      if (exceptionError.getException() instanceof GraphQLError) {
        return (GraphQLError) exceptionError.getException();
      }
    }
    return error;
  }
}
