package io.github.bbortt.event.planner.config;

import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphQLScalarsConfig {

  @Bean
  public GraphQLScalarType dateTime() {
    return GraphQLScalarType
      .newScalar()
      .name("Date")
      .description("Java LocalDate from scalar.")
      .coercing(
        new Coercing<LocalDate, String>() {
          @Override
          public String serialize(Object dataFetcherResult) throws CoercingSerializeException {
            LocalDate localDate = (LocalDate) dataFetcherResult;
            return localDate.toString();
          }

          @Override
          public LocalDate parseValue(Object input) throws CoercingParseValueException {
            return ZonedDateTime.parse((String) input).toLocalDate();
          }

          @Override
          public LocalDate parseLiteral(Object input) throws CoercingParseLiteralException {
            return ZonedDateTime.parse((String) input).toLocalDate();
          }
        }
      )
      .build();
  }
}
