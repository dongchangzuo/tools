package com.tools.auth.service;

import com.tools.auth.config.AppProperties;
import com.tools.auth.dto.MessageResponse;
import com.tools.auth.dto.ResetPasswordRequest;
import com.tools.auth.dto.VerifyResetCodeResponse;
import com.tools.auth.entity.PasswordResetCode;
import com.tools.auth.entity.User;
import com.tools.auth.exception.ApiException;
import com.tools.auth.exception.ErrorCode;
import com.tools.auth.repository.PasswordResetCodeRepository;
import com.tools.auth.repository.UserRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {

    private static final String FORGOT_MESSAGE = "如果该邮箱已注册，我们已向您的邮箱发送重置验证码。";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetCodeRepository resetCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AppProperties appProperties;

    public PasswordResetService(
        UserRepository userRepository,
        PasswordResetCodeRepository resetCodeRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        EmailService emailService,
        AppProperties appProperties
    ) {
        this.userRepository = userRepository;
        this.resetCodeRepository = resetCodeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.appProperties = appProperties;
    }

    @Transactional
    public MessageResponse forgotPassword(String emailRaw) {
        String email = emailRaw.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String code = generateCode();
            Instant expiresAt = Instant.now().plusSeconds(appProperties.expirationMinutes() * 60);
            invalidateActiveCodes(user.getId());
            resetCodeRepository.save(new PasswordResetCode(UUID.randomUUID(), user, passwordEncoder.encode(code), expiresAt));
            emailService.sendPasswordResetCode(email, code);
        }
        return new MessageResponse(FORGOT_MESSAGE);
    }

    @Transactional
    public VerifyResetCodeResponse verifyCode(String emailRaw, String code) {
        String email = emailRaw.trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> notFound());
        PasswordResetCode resetCode = resetCodeRepository
            .findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(user.getId())
            .orElseThrow(() -> notFound());
        if (resetCode.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(ErrorCode.RESET_CODE_EXPIRED, HttpStatus.BAD_REQUEST, "验证码已过期，请重新获取。");
        }
        if (!passwordEncoder.matches(code, resetCode.getCodeHash())) {
            throw new ApiException(ErrorCode.INVALID_RESET_CODE, HttpStatus.BAD_REQUEST, "验证码不正确，请重新输入。");
        }
        resetCode.markUsed();
        resetCodeRepository.save(resetCode);
        String resetToken = jwtService.createResetToken(user);
        return new VerifyResetCodeResponse(resetToken, jwtService.getResetExpirationSeconds());
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        UUID userId = jwtService.parseResetToken(request.resetToken());
        User user = userRepository.findById(userId)
            .orElseThrow(() -> invalidResetToken());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);
        invalidateActiveCodes(user.getId());
        return new MessageResponse("密码已重置，请使用新密码登录。");
    }

    private void invalidateActiveCodes(UUID userId) {
        resetCodeRepository.findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(userId)
            .ifPresent(code -> {
                code.markUsed();
                resetCodeRepository.save(code);
            });
    }

    private static String generateCode() {
        int value = RANDOM.nextInt(1_000_000);
        return String.format("%06d", value);
    }

    private ApiException notFound() {
        return new ApiException(
            ErrorCode.RESET_CODE_NOT_FOUND,
            HttpStatus.BAD_REQUEST,
            "请先获取验证码，或重新发送重置邮件。"
        );
    }

    private ApiException invalidResetToken() {
        return new ApiException(
            ErrorCode.INVALID_RESET_TOKEN,
            HttpStatus.BAD_REQUEST,
            "重置链接无效或已过期，请重新获取验证码。"
        );
    }
}
