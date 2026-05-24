package com.tools.auth.service;

import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final boolean mockMail;
    private final String mockBaseUrl;
    private final String baseUrl;

    public EmailService(
        JavaMailSender mailSender,
        @Value("${spring.mail.username:}") String fromAddress,
        @Value("${app.mail.mock:false}") boolean mockMail,
        @Value("${app.mail.mock-base-url:http://localhost:8080}") String mockBaseUrl,
        @Value("${app.mail.base-url:http://localhost:8080}") String baseUrl
    ) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.mockMail = mockMail;
        this.mockBaseUrl = mockBaseUrl;
        this.baseUrl = baseUrl;
    }

    public void sendPasswordResetCode(String email, String code) {
        if (mockMail) {
            log.info(
                "【DEV 邮件模拟】目标邮箱：{}，主题：{}，验证码：{}",
                email,
                "重置密码验证码",
                code
            );
            return;
        }

        sendEmail(
            email,
            "重置密码验证码",
            "您的重置密码验证码为：" + code + "。验证码 10 分钟内有效，请勿泄露给他人。"
        );
    }

    public void sendActivationLink(String email, UUID activationToken) {
        String link = buildActivationLink(activationToken);
        if (mockMail) {
            log.info(
                "【DEV 邮件模拟】目标邮箱：{}，主题：{}，验证链接：{}",
                email,
                "邮箱激活链接",
                link
            );
            return;
        }

        sendEmail(
            email,
            "邮箱激活链接",
            "请点击下面的链接完成邮箱激活：\n" + link
        );
    }

    private void sendEmail(String email, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            message.setText(text);
            if (StringUtils.hasText(fromAddress)) {
                message.setFrom(fromAddress);
            }
            mailSender.send(message);
            log.info("邮件已发送到 {}，主题：{}", email, subject);
        } catch (MailException ex) {
            log.error("发送邮件失败，目标邮箱：{}，原因：{}", email, ex.getMessage(), ex);
            throw ex;
        }
    }

    private String buildActivationLink(UUID activationToken) {
        String base = mockMail ? mockBaseUrl : baseUrl;
        return base + "/api/v1/auth/verify-email?token=" + activationToken;
    }
}
