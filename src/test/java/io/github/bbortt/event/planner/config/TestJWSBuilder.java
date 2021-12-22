package io.github.bbortt.event.planner.config;

import java.util.UUID;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TestJWSBuilder {

  private static final Logger logger = LoggerFactory.getLogger(TestJWSBuilder.class);

  private String claimsIssuer;
  private String claimsSubject;
  private String claimsAudience;
  private RsaJsonWebKey rsaJsonWebKey;

  private TestJWSBuilder() {
    // Singleton
  }

  static TestJWSBuilder getInstance() {
    return JWSBuilderHolder.INSTANCE;
  }

  public void setClaimsIssuer(String claimsIssuer) {
    this.claimsIssuer = claimsIssuer;
  }

  public String getClaimsSubject() {
    return claimsSubject;
  }

  public void setClaimsSubject(String claimsSubject) {
    this.claimsSubject = claimsSubject;
  }

  public void setClaimsAudience(String claimsAudience) {
    this.claimsAudience = claimsAudience;
  }

  RsaJsonWebKey getRsaJsonWebKey() {
    return rsaJsonWebKey;
  }

  public void setRsaJsonWebKey(RsaJsonWebKey rsaJsonWebKey) {
    this.rsaJsonWebKey = rsaJsonWebKey;
  }

  public JsonWebSignature build() {
    return build("");
  }

  public JsonWebSignature build(String scope) {
    logger.info("Building JWS with scope(s): {}", scope);

    String paddedScope = scope.startsWith(" ") ? scope : " " + scope;

    JwtClaims claims = new JwtClaims();
    claims.setJwtId(UUID.randomUUID().toString());
    claims.setIssuer(claimsIssuer);
    claims.setSubject(claimsSubject);
    claims.setAudience(claimsAudience);
    claims.setExpirationTimeMinutesInTheFuture(10F);
    claims.setIssuedAtToNow();
    claims.setClaim("azp", "integration-test-client");
    claims.setClaim("scope", "openid profile email" + paddedScope);

    JsonWebSignature jws = new JsonWebSignature();
    jws.setPayload(claims.toJson());
    jws.setKey(rsaJsonWebKey.getPrivateKey());
    jws.setAlgorithmHeaderValue(rsaJsonWebKey.getAlgorithm());
    jws.setKeyIdHeaderValue(rsaJsonWebKey.getKeyId());
    jws.setHeader("typ", "JWT");

    return jws;
  }

  private static class JWSBuilderHolder {

    static final TestJWSBuilder INSTANCE = getInstance();

    private static TestJWSBuilder getInstance() {
      return new TestJWSBuilder();
    }
  }
}
