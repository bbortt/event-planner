package io.github.bbortt.event.planner.config;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.options;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.extension.responsetemplating.ResponseTemplateTransformer;
import java.util.UUID;
import org.jose4j.jwk.JsonWebKeySet;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.extension.AfterAllCallback;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.http.MediaType;

public class WireMockServerExtension implements AfterAllCallback, BeforeAllCallback {

  private static final TestJWSBuilder JWS_BUILDER = TestJWSBuilder.getInstance();

  private WireMockServer wireMockServer;

  @Override
  public void beforeAll(ExtensionContext context) throws Exception {
    wireMockServer = new WireMockServer(options().extensions(new ResponseTemplateTransformer(true)).port(0));
    wireMockServer.start();

    initJWSBuilder();
    registerJWTIssuerStub();

    System.setProperty("wiremock.server.port", String.valueOf(wireMockServer.port()));
  }

  private void initJWSBuilder() throws JoseException {
    String claimsSubject = UUID.randomUUID().toString();
    JWS_BUILDER.setClaimsSubject(claimsSubject);

    RsaJsonWebKey rsaJsonWebKey = RsaJwkGenerator.generateJwk(2048);
    rsaJsonWebKey.setKeyId("k1");
    rsaJsonWebKey.setAlgorithm(AlgorithmIdentifiers.RSA_USING_SHA256);
    rsaJsonWebKey.setUse("sig");
    JWS_BUILDER.setRsaJsonWebKey(rsaJsonWebKey);
  }

  private void registerJWTIssuerStub() {
    wireMockServer.stubFor(
      get(urlEqualTo("/.well-known/jwks.json"))
        .willReturn(
          aResponse()
            .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .withBody(new JsonWebKeySet(JWS_BUILDER.getRsaJsonWebKey()).toJson())
        )
    );
  }

  @Override
  public void afterAll(ExtensionContext context) {
    wireMockServer.stop();
  }
}
