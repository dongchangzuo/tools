package com.tools.auth.service;

import com.tools.auth.config.JwtProperties;
import com.tools.auth.entity.User;
import com.tools.auth.exception.ApiException;
import com.tools.auth.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private static final String TOKEN_TYPE_ACCESS = "access";
    private static final String TOKEN_TYPE_RESET = "reset";

    private final JwtProperties properties;
    private final SecretKey accessKey;
    private final SecretKey resetKey;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.accessKey = hmacKey(requireSecret(properties.secret(), "app.jwt.secret"));
        this.resetKey = hmacKey(requireSecret(properties.resetSecret(), "app.jwt.reset-secret"));
    }

    private static String requireSecret(String value, String propertyName) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(propertyName + " must not be blank");
        }
        return value;
    }

    /**
     * HS256 requires >= 256-bit keys. Short dev secrets are stretched with SHA-256.
     */
    static SecretKey hmacKey(String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length >= 32) {
            return Keys.hmacShaKeyFor(bytes);
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return Keys.hmacShaKeyFor(digest.digest(bytes));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 not available", ex);
        }
    }

    public String createAccessToken(User user, boolean rememberMe) {
        long ttl = rememberMe ? properties.rememberExpirationSeconds() : properties.accessExpirationSeconds();
        return buildToken(user.getId(), TOKEN_TYPE_ACCESS, accessKey, ttl);
    }

    public long getAccessExpirationSeconds(boolean rememberMe) {
        return rememberMe ? properties.rememberExpirationSeconds() : properties.accessExpirationSeconds();
    }

    public String createResetToken(User user) {
        return buildToken(user.getId(), TOKEN_TYPE_RESET, resetKey, properties.resetExpirationSeconds());
    }

    public long getResetExpirationSeconds() {
        return properties.resetExpirationSeconds();
    }

    public UUID parseAccessToken(String token) {
        return parseToken(token, TOKEN_TYPE_ACCESS, accessKey);
    }

    public UUID parseResetToken(String token) {
        return parseToken(token, TOKEN_TYPE_RESET, resetKey);
    }

    private String buildToken(UUID userId, String type, SecretKey key, long ttlSeconds) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(userId.toString())
            .claim("type", type)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(ttlSeconds)))
            .signWith(key)
            .compact();
    }

    private UUID parseToken(String token, String expectedType, SecretKey key) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            String type = claims.get("type", String.class);
            if (!expectedType.equals(type)) {
                throw invalidToken();
            }
            return UUID.fromString(claims.getSubject());
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw invalidToken();
        }
    }

    private ApiException invalidToken() {
        return new ApiException(ErrorCode.INVALID_RESET_TOKEN, HttpStatus.BAD_REQUEST, "重置链接无效或已过期，请重新获取验证码。");
    }
}
