package io.github.bbortt.event.planner.repository;

import io.github.bbortt.event.planner.domain.Invitation;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Invitation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    @Query("select invitation from Invitation invitation where invitation.user.login = ?#{principal.username}")
    List<Invitation> findByUserIsCurrentUser();

    Page<Invitation> findAllByProjectId(Long projectId, Pageable pageable);
}
