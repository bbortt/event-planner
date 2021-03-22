package io.github.bbortt.event.planner.backend.repository;

import io.github.bbortt.event.planner.backend.domain.Invitation;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Invitation entity.
 */
@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Page<Invitation> findAllByProjectId(Long projectId, Pageable pageable);

    @Modifying
    @Query("UPDATE Invitation SET user.id = :userId, token = null, accepted = true WHERE token = :token")
    void assignUserToInvitation(@Param("userId") String userId, @Param("token") String token);

    Optional<Invitation> findByToken(String token);

    Optional<Invitation> findOneByEmailAndProjectId(String email, Long projectId);

    Optional<Invitation> findOneByUserIdAndProjectId(String userId, Long projectId);

    List<Invitation> findAllByAcceptedIsFalseAndTokenIsNotNullAndCreatedDateBefore(Instant createdDate);
}
