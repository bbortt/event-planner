package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Member;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Member entity.
 */
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    default Optional<Member> findOneWithEagerRelationships(Long id) {
        return this.findById(id);
    }

    default Page<Member> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAll(pageable);
    }

    @Override
    @EntityGraph(attributePaths = { "project" })
    Page<Member> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = { "project" })
    Optional<Member> findById(@Param("id") Long id);

    Page<Member> findAllByProjectIdEquals(@Param("projectId") Long projectId, Pageable pageable);

    @Query(
        "SELECT DISTINCT m FROM Member m" +
        "  WHERE m.invitedEmail = :email" +
        "  OR m.acceptedBy = :email" +
        "  AND m.project.id = :projectId"
    )
    Optional<Member> findMemberInProject(@Param("email") String email, @Param("projectId") Long projectId);
}
