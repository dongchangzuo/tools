package com.tools.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Test
    void sendActivationLink_inMockMode_logsVerificationLinkAndSkipsRealMail(CapturedOutput output) {
        EmailService emailService = new EmailService(
            mailSender,
            "noreply@example.com",
            true,
            "http://localhost:8000",
            "http://localhost:8000"
        );
        UUID activationToken = UUID.fromString("11111111-1111-1111-1111-111111111111");

        emailService.sendActivationLink("alice@example.com", activationToken);

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        assertThat(output).contains("【DEV 邮件模拟】目标邮箱：alice@example.com");
        assertThat(output).contains("验证链接：http://localhost:8000/api/v1/auth/verify-email?token=11111111-1111-1111-1111-111111111111");
    }

    @Test
    void sendPasswordResetCode_inMockMode_onlyLogsResetMessage(CapturedOutput output) {
        EmailService emailService = new EmailService(
            mailSender,
            "noreply@example.com",
            true,
            "http://localhost:8000",
            "http://localhost:8000"
        );

        emailService.sendPasswordResetCode("bob@example.com", "654321");

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        assertThat(output).doesNotContain("验证链接");
        assertThat(output).contains("【DEV 邮件模拟】目标邮箱：bob@example.com，主题：重置密码验证码，验证码：654321");
    }
}
