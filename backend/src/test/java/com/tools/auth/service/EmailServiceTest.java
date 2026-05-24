package com.tools.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

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
    void sendActivationCode_inMockMode_logsVerificationLinkAndSkipsRealMail(CapturedOutput output) {
        EmailService emailService = new EmailService(mailSender, "noreply@example.com", true, "http://localhost:8000");

        emailService.sendActivationCode("alice@example.com", "123456");

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        assertThat(output).contains("【DEV 邮件模拟】目标邮箱：alice@example.com");
        assertThat(output).contains("验证链接：http://localhost:8000/api/v1/auth/verify-email?code=MOCK_alice_example_com");
    }

    @Test
    void sendPasswordResetCode_inMockMode_logsVerificationLinkAndSkipsRealMail(CapturedOutput output) {
        EmailService emailService = new EmailService(mailSender, "noreply@example.com", true, "http://localhost:8000");

        emailService.sendPasswordResetCode("bob@example.com", "654321");

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        assertThat(output).contains("【DEV 邮件模拟】目标邮箱：bob@example.com");
        assertThat(output).contains("验证链接：http://localhost:8000/api/v1/auth/verify-reset-code?code=MOCK_bob_example_com");
    }
}
