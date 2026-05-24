package com.tools.auth.service;

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

    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username:}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendPasswordResetCode(String email, String code) {
        sendEmail(
            email,
            "重置密码验证码",
            "您的重置密码验证码为：" + code + "。验证码 10 分钟内有效，请勿泄露给他人。"
        );
    }

    public void sendActivationCode(String email, String code) {
        sendEmail(
            email,
            "邮箱激活验证码",
            "您的邮箱激活验证码为：" + code + "。验证码 10 分钟内有效，请在完成注册后尽快激活。"
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
}
