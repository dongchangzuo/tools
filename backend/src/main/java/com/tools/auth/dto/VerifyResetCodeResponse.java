package com.tools.auth.dto;

public record VerifyResetCodeResponse(String resetToken, long expiresIn) {}
