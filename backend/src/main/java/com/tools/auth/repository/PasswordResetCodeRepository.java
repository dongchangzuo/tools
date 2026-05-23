package com.tools.auth.repository;

import com.tools.auth.entity.PasswordResetCode;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, UUID> {

    Optional<PasswordResetCode> findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(UUID userId);
}
