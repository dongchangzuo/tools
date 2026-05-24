package com.tools.auth.service;

import com.tools.auth.config.AppProperties;
import com.tools.auth.dto.MessageResponse;
import com.tools.auth.entity.EmailActivationCode;
import com.tools.auth.entity.User;
import com.tools.auth.exception.ApiException;
import com.tools.auth.exception.ErrorCode;
import com.tools.auth.repository.EmailActivationCodeRepository;
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
public class EmailActivationService {

    private static final String ACTIVATION_MESSAGE = "如果该邮箱已注册，我们已向您的邮箱发送激活验证码。";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final EmailActivationCodeRepository activationCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AppProperties appProperties;

    public EmailActivationService(
        UserRepository userRepository,
        EmailActivationCodeRepository activationCodeRepository,
        PasswordEncoder passwordEncoder,
        EmailService emailService,
        AppProperties appProperties
    ) {
        this.userRepository = userRepository;
        this.activationCodeRepository = activationCodeRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.appProperties = appProperties;
    }

    @Transactional
    public MessageResponse sendActivationCode(String emailRaw) {
        String email = emailRaw.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.isEmailVerified()) {
                return new MessageResponse("邮箱已激活，无需重复发送。");
            }
            String code = generateCode();
            Instant expiresAt = Instant.now().plusSeconds(appProperties.expirationMinutes() * 60);
            invalidateActiveCodes(user.getId());
            activationCodeRepository.save(new EmailActivationCode(UUID.randomUUID(), user, passwordEncoder.encode(code), expiresAt));
            emailService.sendActivationCode(email, code);
        }
        return new MessageResponse(ACTIVATION_MESSAGE);
    }

    @Transactional
    public MessageResponse verifyCode(String emailRaw, String code) {
        String email = emailRaw.trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(this::activationNotFound);

        if (user.isEmailVerified()) {
            return new MessageResponse("邮箱已激活。");
        }

        EmailActivationCode activationCode = activationCodeRepository
            .findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(user.getId())
            .orElseThrow(this::activationNotFound);

        if (activationCode.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(ErrorCode.ACTIVATION_CODE_EXPIRED, HttpStatus.BAD_REQUEST, "激活验证码已过期，请重新获取。");
        }

        if (!passwordEncoder.matches(code, activationCode.getCodeHash())) {
            throw new ApiException(ErrorCode.INVALID_ACTIVATION_CODE, HttpStatus.BAD_REQUEST, "激活验证码不正确，请重新输入。");
        }

        activationCode.markUsed();
        activationCodeRepository.save(activationCode);
        user.markEmailVerified();
        userRepository.save(user);
        return new MessageResponse("邮箱激活成功。");
    }

    private void invalidateActiveCodes(UUID userId) {
        activationCodeRepository.findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(userId)
            .ifPresent(code -> {
                code.markUsed();
                activationCodeRepository.save(code);
            });
    }

    private static String generateCode() {
        int value = RANDOM.nextInt(1_000_000);
        return String.format("%06d", value);
    }

    private ApiException activationNotFound() {
        return new ApiException(
            ErrorCode.ACTIVATION_CODE_NOT_FOUND,
            HttpStatus.BAD_REQUEST,
            "请先获取激活验证码，或重新发送激活邮件。"
        );
    }
}
