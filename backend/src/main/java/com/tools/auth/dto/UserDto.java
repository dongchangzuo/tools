package com.tools.auth.dto;

import com.tools.auth.entity.User;
import java.util.UUID;

public record UserDto(UUID id, String username, String email) {

    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }
}
