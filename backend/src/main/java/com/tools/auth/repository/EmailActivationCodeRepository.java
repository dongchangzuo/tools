package com.tools.auth.repository;

import com.tools.auth.entity.EmailActivationCode;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailActivationCodeRepository extends JpaRepository<EmailActivationCode, UUID> {

    Optional<EmailActivationCode> findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(UUID userId);
}
