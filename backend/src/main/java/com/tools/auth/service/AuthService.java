package com.tools.auth.service;

import com.tools.auth.dto.AuthResponse;
import com.tools.auth.dto.LoginRequest;
import com.tools.auth.dto.RegisterRequest;
import com.tools.auth.dto.RegisterResponse;
import com.tools.auth.dto.UserDto;
import com.tools.auth.entity.User;
import com.tools.auth.exception.ApiException;
import com.tools.auth.exception.ErrorCode;
import com.tools.auth.repository.UserRepository;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailActivationService emailActivationService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        EmailActivationService emailActivationService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailActivationService = emailActivationService;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = normalizeAndValidateEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw emailExists(email);
        }
        User user = new User(
            UUID.randomUUID(),
            request.username().trim(),
            email,
            passwordEncoder.encode(request.password())
        );
        try {
            userRepository.save(user);
            emailActivationService.sendActivationCode(email);
        } catch (DataIntegrityViolationException ex) {
            throw emailExists(email);
        }
        return new RegisterResponse("注册成功，请查收邮箱完成激活。", UserDto.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeAndValidateEmail(request.email());
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(this::invalidCredentials);
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw invalidCredentials();
        }
        if (!user.isEmailVerified()) {
            throw emailNotVerified();
        }
        boolean rememberMe = Boolean.TRUE.equals(request.rememberMe());
        String token = jwtService.createAccessToken(user, rememberMe);
        long expiresIn = jwtService.getAccessExpirationSeconds(rememberMe);
        return new AuthResponse(token, "Bearer", expiresIn, UserDto.from(user));
    }

    public UserDto getMe(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ApiException(ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, "未登录或登录已过期。"));
        return UserDto.from(user);
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private static String normalizeAndValidateEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        if (!isValidEmail(normalizedEmail)) {
            throw invalidEmailFormat();
        }
        return normalizedEmail;
    }

    private static boolean isValidEmail(String email) {
        try {
            InternetAddress address = new InternetAddress(email, true);
            address.validate();
            return true;
        } catch (AddressException ex) {
            return false;
        }
    }

    private ApiException emailExists(String email) {
        return new ApiException(
            ErrorCode.EMAIL_ALREADY_EXISTS,
            HttpStatus.CONFLICT,
            "该邮箱已存在：" + email + "。请改用其他邮箱，或直接返回登录。"
        );
    }

    private ApiException invalidCredentials() {
        return new ApiException(
            ErrorCode.INVALID_CREDENTIALS,
            HttpStatus.UNAUTHORIZED,
            "邮箱或密码错误，请重试。"
        );
    }

    private static ApiException invalidEmailFormat() {
        return new ApiException(
            ErrorCode.VALIDATION_ERROR,
            HttpStatus.BAD_REQUEST,
            "邮箱格式不正确，请输入如 name@company.com 的地址。"
        );
    }

    private ApiException emailNotVerified() {
        return new ApiException(
            ErrorCode.EMAIL_NOT_VERIFIED,
            HttpStatus.FORBIDDEN,
            "邮箱尚未激活，请先完成邮箱激活后再登录。"
        );
    }
}
