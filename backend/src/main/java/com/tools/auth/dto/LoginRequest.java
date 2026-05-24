package com.tools.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "请输入邮箱地址。")
    @Email(message = "邮箱格式不正确，请输入如 name@company.com 的地址。")
    String email,

    @NotBlank(message = "请输入密码。")
    String password,

    Boolean rememberMe
) {}
