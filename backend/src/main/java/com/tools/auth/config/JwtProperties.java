package com.tools.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
    String secret,
    String resetSecret,
    long accessExpirationSeconds,
    long rememberExpirationSeconds,
    long resetExpirationSeconds
) {}
