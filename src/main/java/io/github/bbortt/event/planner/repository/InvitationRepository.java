package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Invitation;
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
    void assignUserToInvitation(@Param("userId") Long userId, @Param("token") String token);

    Optional<Invitation> findByToken(String token);

    Optional<Invitation> findOnyByEmailAndProjectId(String email, Long projectId);
}
