package com.tools.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
    @NotBlank(message = "请提供重置令牌。")
    String resetToken,

    @NotBlank(message = "请输入新的密码。")
    @Size(min = 8, max = 64, message = "密码长度为 8-64 个字符。")
    String password
) {}
