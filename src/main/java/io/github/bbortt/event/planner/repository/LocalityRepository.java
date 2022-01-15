package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Locality;
import io.github.bbortt.event.planner.domain.Project;
import java.util.Set;
import net.bytebuddy.asm.Advice.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, Long> {
  Set<Locality> findAllByProjectIdEqualsAndParentEquals(Long projectId, Locality locality);
}
