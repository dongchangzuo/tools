package com.tools.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    public void sendPasswordResetCode(String email, String code) {
        log.info("[DEV] Password reset code for {}: {}", email, code);
    }
}
