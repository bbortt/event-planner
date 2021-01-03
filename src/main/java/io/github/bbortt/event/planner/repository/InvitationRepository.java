package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Invitation;
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
    @Query("select invitation from Invitation invitation where invitation.user.login = ?#{principal.username}")
    List<Invitation> findByUserIsCurrentUser();

    Page<Invitation> findAllByProjectId(Long projectId, Pageable pageable);

    @Modifying
    @Query("update Invitation set user.id = :userId, token = null, accepted = true where token = :token")
    void assignUserToInvitation(@Param("userId") Long userId, String token);

    Optional<Invitation> findByToken(String token);
}
