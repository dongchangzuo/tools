package com.tools.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForgotPasswordRequest(
    @NotBlank(message = "请输入邮箱地址。")
    @Email(message = "邮箱格式不正确，请输入如 name@company.com 的地址。")
    @Size(max = 254)
    String email
) {}
