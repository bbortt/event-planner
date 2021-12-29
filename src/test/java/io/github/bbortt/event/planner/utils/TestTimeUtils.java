package io.github.bbortt.event.planner.utils;

import java.time.Instant;
import java.time.ZoneOffset;

public class TestTimeUtils {

  private TestTimeUtils() {
    // Static access only
  }

  public static ZoneOffset systemDefaultZoneOffset() {
    return ZoneOffset.systemDefault().getRules().getOffset(Instant.now());
  }
}
