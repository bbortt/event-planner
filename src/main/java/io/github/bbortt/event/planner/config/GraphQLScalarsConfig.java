package io.github.bbortt.event.planner.config;

import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;
import java.time.OffsetDateTime;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphQLScalarsConfig {

  @Bean
  public GraphQLScalarType dateTime() {
    return GraphQLScalarType
      .newScalar()
      .name("DateTime")
      .description("Date & time with offset information.")
      .coercing(
        new Coercing<OffsetDateTime, String>() {
          @Override
          public String serialize(Object dataFetcherResult) throws CoercingSerializeException {
            OffsetDateTime localDateTime = (OffsetDateTime) dataFetcherResult;
            return localDateTime.toString();
          }

          @Override
          public OffsetDateTime parseValue(Object input) throws CoercingParseValueException {
            return OffsetDateTime.parse((String) input);
          }

          @Override
          public OffsetDateTime parseLiteral(Object input) throws CoercingParseLiteralException {
            return OffsetDateTime.parse((String) input);
          }
        }
      )
      .build();
  }
}
