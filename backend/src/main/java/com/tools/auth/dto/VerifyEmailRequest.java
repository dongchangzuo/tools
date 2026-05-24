package com.tools.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyEmailRequest(
    @NotBlank(message = "请输入邮箱地址。")
    @Email(message = "邮箱格式不正确，请输入如 name@company.com 的地址。")
    String email,

    @NotBlank(message = "请输入 6 位数字验证码。")
    @Pattern(regexp = "^\\d{6}$", message = "请输入 6 位数字验证码。")
    String code
) {}
