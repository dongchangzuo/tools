package com.tools.auth.service;

import static org.assertj.core.api.Assertions.assertThatCode;

import org.junit.jupiter.api.Test;

class JwtServiceTest {

    @Test
    void hmacKey_acceptsShortSecret() {
        assertThatCode(() -> JwtService.hmacKey("dev")).doesNotThrowAnyException();
    }
}
