package com.tools.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tools.auth.dto.LoginRequest;
import com.tools.auth.dto.RegisterRequest;
import com.tools.auth.entity.User;
import com.tools.auth.exception.ApiException;
import com.tools.auth.exception.ErrorCode;
import com.tools.auth.repository.UserRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailActivationService emailActivationService;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, passwordEncoder, jwtService, emailActivationService);
    }

    @Test
    void register_rejectsDuplicateEmail() {
        when(userRepository.existsByEmailIgnoreCase("taken@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(
            new RegisterRequest("alice", "Taken@Example.com", "password123")
        ))
            .isInstanceOf(ApiException.class)
            .satisfies(ex -> {
                ApiException api = (ApiException) ex;
                assertThat(api.getCode()).isEqualTo(ErrorCode.EMAIL_ALREADY_EXISTS);
            });

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_rejectsWrongPassword() {
        User user = new User(UUID.randomUUID(), "alice", "alice@example.com", passwordEncoder.encode("correct-pass"));
        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(new LoginRequest("alice@example.com", "wrong-pass", false)))
            .isInstanceOf(ApiException.class)
            .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo(ErrorCode.INVALID_CREDENTIALS));
    }

    @Test
    void login_rejectsUnverifiedEmail() {
        User user = new User(UUID.randomUUID(), "alice", "alice@example.com", passwordEncoder.encode("correct-pass"));
        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(new LoginRequest("alice@example.com", "correct-pass", false)))
            .isInstanceOf(ApiException.class)
            .satisfies(ex -> assertThat(((ApiException) ex).getCode()).isEqualTo(ErrorCode.EMAIL_NOT_VERIFIED));
    }

    @Test
    void register_storesLowercaseEmail() {
        when(userRepository.existsByEmailIgnoreCase("new@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.register(new RegisterRequest("alice", "New@Example.com", "password123"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getEmail()).isEqualTo("new@example.com");
    }

    @Test
    void register_rejectsInvalidEmailFormat() {
        assertThatThrownBy(() -> authService.register(
            new RegisterRequest("alice", "invalid-email", "password123")
        ))
            .isInstanceOf(ApiException.class)
            .satisfies(ex -> {
                ApiException api = (ApiException) ex;
                assertThat(api.getCode()).isEqualTo(ErrorCode.VALIDATION_ERROR);
                assertThat(api.getMessage()).isEqualTo("邮箱格式不正确，请输入如 name@company.com 的地址。");
            });

        verify(userRepository, never()).save(any());
        verify(emailActivationService, never()).sendActivationCode(any());
    }
}
