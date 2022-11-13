FROM quay.io/quarkus/quarkus-micro-image:1.0

LABEL author="Timon Borter <bbortt.github.io>"

CMD ["./application", "-Dquarkus.http.host=0.0.0.0"]

EXPOSE 8080

WORKDIR /work/

COPY build/permissions-service-*-runner /work/application

RUN chmod 775 /work /work/application \
  && chown -R 1001 /work \
  && chmod -R "g+rwX" /work

USER 1001
