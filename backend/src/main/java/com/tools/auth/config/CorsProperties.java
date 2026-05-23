package com.tools.auth.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(
    List<String> allowedOrigins,
    List<String> allowedOriginPatterns
) {

    public List<String> allowedOrigins() {
        return allowedOrigins != null ? allowedOrigins : List.of();
    }

    public List<String> allowedOriginPatterns() {
        return allowedOriginPatterns != null ? allowedOriginPatterns : List.of();
    }
}
