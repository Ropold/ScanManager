package ropold.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import ropold.backend.model.UserModel;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserModel, UUID> {
    Optional<UserModel> findByMicrosoftId(String microsoftId);

    @Modifying
    @Transactional
    @Query("UPDATE UserModel u SET u.preferredLanguage = :language WHERE u.microsoftId = :microsoftId")
    void updatePreferredLanguage(@Param("microsoftId") String microsoftId, @Param("language") String language);
}