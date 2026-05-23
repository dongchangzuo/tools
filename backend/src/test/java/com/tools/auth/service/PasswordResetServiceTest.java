package com.tools.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.tools.auth.config.AppProperties;
import com.tools.auth.entity.PasswordResetCode;
import com.tools.auth.entity.User;
import com.tools.auth.exception.ApiException;
import com.tools.auth.exception.ErrorCode;
import com.tools.auth.repository.PasswordResetCodeRepository;
import com.tools.auth.repository.UserRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetCodeRepository resetCodeRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailService emailService;

    private PasswordResetService passwordResetService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        passwordResetService = new PasswordResetService(
            userRepository,
            resetCodeRepository,
            passwordEncoder,
            jwtService,
            emailService,
            new AppProperties(10)
        );
    }

    @Test
    void verifyCode_rejectsInvalidCode() {
        User user = new User(UUID.randomUUID(), "alice", "alice@example.com", passwordEncoder.encode("pass"));
        String codeHash = passwordEncoder.encode("123456");
        PasswordResetCode resetCode = new PasswordResetCode(UUID.randomUUID(), user, codeHash, Instant.now().plusSeconds(600));

        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(user));
        when(resetCodeRepository.findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(user.getId()))
            .thenReturn(Optional.of(resetCode));

        assertThatThrownBy(() -> passwordResetService.verifyCode("alice@example.com", "000000"))
            .isInstanceOf(ApiException.class)
            .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo(ErrorCode.INVALID_RESET_CODE));
    }
}
