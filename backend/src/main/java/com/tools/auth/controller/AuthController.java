package com.tools.auth.controller;

import com.tools.auth.dto.AuthResponse;
import com.tools.auth.dto.ForgotPasswordRequest;
import com.tools.auth.dto.LoginRequest;
import com.tools.auth.dto.MessageResponse;
import com.tools.auth.dto.RegisterRequest;
import com.tools.auth.dto.RegisterResponse;
import com.tools.auth.dto.ResetPasswordRequest;
import com.tools.auth.dto.UserDto;
import com.tools.auth.dto.VerifyResetCodeRequest;
import com.tools.auth.dto.VerifyResetCodeResponse;
import com.tools.auth.security.AuthUserPrincipal;
import com.tools.auth.service.AuthService;
import com.tools.auth.service.PasswordResetService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return passwordResetService.forgotPassword(request.email());
    }

    @PostMapping("/verify-reset-code")
    public VerifyResetCodeResponse verifyResetCode(@Valid @RequestBody VerifyResetCodeRequest request) {
        return passwordResetService.verifyCode(request.email(), request.code());
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return passwordResetService.resetPassword(request);
    }

    @GetMapping("/me")
    public Map<String, UserDto> me(@AuthenticationPrincipal AuthUserPrincipal principal) {
        return Map.of("user", authService.getMe(principal.getUserId()));
    }
}
