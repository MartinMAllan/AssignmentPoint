package com.assignmentpoint.mapper;

import com.assignmentpoint.dto.UserResponseDTO;
import com.assignmentpoint.entity.User;

public class UserMapper {

    public static UserResponseDTO toResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .isActive(user.getIsActive())
                .isEmailVerified(user.getIsEmailVerified())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}
