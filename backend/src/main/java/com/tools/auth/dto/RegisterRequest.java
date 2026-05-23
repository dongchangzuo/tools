package com.tools.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "请输入你的用户名。")
    @Size(min = 2, max = 20, message = "用户名长度需为 2-20 个字符。")
    @Pattern(regexp = "^[A-Za-z0-9_\\u4e00-\\u9fff-]+$", message = "用户名只能包含字母、数字、中划线、下划线或中文。")
    String username,

    @NotBlank(message = "请输入邮箱地址。")
    @Email(message = "邮箱格式不正确，请输入如 name@company.com 的地址。")
    @Size(max = 254, message = "邮箱长度不能超过 254 个字符。")
    String email,

    @NotBlank(message = "请输入密码。")
    @Size(min = 8, max = 64, message = "密码长度为 8-64 个字符。")
    String password
) {}
