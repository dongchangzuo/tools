package com.tools.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
import org.mockito.ArgumentCaptor;
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
    void sendActivationCode_createsActivationLinkAndSendsIt() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User user = new User(UUID.randomUUID(), "alice", "alice@example.com", encoder.encode("pass"));

        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(user));
        when(activationCodeRepository.save(any(EmailActivationCode.class))).thenAnswer(invocation -> invocation.getArgument(0));

        emailActivationService.sendActivationCode("alice@example.com");

        ArgumentCaptor<EmailActivationCode> captor = ArgumentCaptor.forClass(EmailActivationCode.class);
        verify(activationCodeRepository).save(captor.capture());
        verify(emailService).sendActivationLink(eq("alice@example.com"), any(UUID.class));
        assertThat(captor.getValue().getUsedAt()).isNull();
        assertThat(captor.getValue().getExpiresAt()).isAfter(Instant.now());
    }

    @Test
    void verifyToken_rejectsInvalidToken() {
        assertThatThrownBy(() -> emailActivationService.verifyToken("not-a-uuid"))
            .isInstanceOf(ApiException.class)
            .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo(ErrorCode.ACTIVATION_CODE_NOT_FOUND));
    }

    @Test
    void verifyToken_marksUserAsVerified() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User user = new User(UUID.randomUUID(), "alice", "alice@example.com", encoder.encode("pass"));
        UUID token = UUID.randomUUID();
        EmailActivationCode activationCode = new EmailActivationCode(
            token,
            user,
            encoder.encode(token.toString()),
            Instant.now().plusSeconds(600)
        );

        when(activationCodeRepository.findById(token)).thenReturn(Optional.of(activationCode));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        emailActivationService.verifyToken(token.toString());

        verify(activationCodeRepository).save(activationCode);
        verify(userRepository).save(user);
        assertThat(user.isEmailVerified()).isTrue();
    }
}
