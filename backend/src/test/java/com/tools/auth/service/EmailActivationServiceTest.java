package com.tools.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tools.auth.config.AppProperties;
import com.tools.auth.entity.EmailActivationCode;
import com.tools.auth.entity.User;
import com.tools.auth.exception.ApiException;
import com.tools.auth.exception.ErrorCode;
import com.tools.auth.repository.EmailActivationCodeRepository;
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
class EmailActivationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailActivationCodeRepository activationCodeRepository;

    @Mock
    private EmailService emailService;

    private EmailActivationService emailActivationService;

    @BeforeEach
    void setUp() {
        emailActivationService = new EmailActivationService(
            userRepository,
            activationCodeRepository,
            new BCryptPasswordEncoder(),
            emailService,
            new AppProperties(10)
        );
    }

    @Test
    void verifyCode_rejectsInvalidCode() {
        User user = new User(UUID.randomUUID(), "alice", "alice@example.com", new BCryptPasswordEncoder().encode("pass"));
        EmailActivationCode activationCode = new EmailActivationCode(
            UUID.randomUUID(),
            user,
            new BCryptPasswordEncoder().encode("123456"),
            Instant.now().plusSeconds(600)
        );

        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(user));
        when(activationCodeRepository.findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(user.getId()))
            .thenReturn(Optional.of(activationCode));

        assertThatThrownBy(() -> emailActivationService.verifyCode("alice@example.com", "000000"))
            .isInstanceOf(ApiException.class)
            .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo(ErrorCode.INVALID_ACTIVATION_CODE));
    }

    @Test
    void verifyCode_marksUserAsVerified() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User user = new User(UUID.randomUUID(), "alice", "alice@example.com", encoder.encode("pass"));
        EmailActivationCode activationCode = new EmailActivationCode(
            UUID.randomUUID(),
            user,
            encoder.encode("123456"),
            Instant.now().plusSeconds(600)
        );

        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(user));
        when(activationCodeRepository.findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(user.getId()))
            .thenReturn(Optional.of(activationCode));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        emailActivationService.verifyCode("alice@example.com", "123456");

        verify(userRepository).save(any(User.class));
    }
}
