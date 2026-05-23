package com.tools.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.reset-code")
public record AppProperties(long expirationMinutes) {}
