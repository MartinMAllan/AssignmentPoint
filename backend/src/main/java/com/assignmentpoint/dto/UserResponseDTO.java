package com.assignmentpoint.dto;

import com.assignmentpoint.entity.User.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private Long id;
    private String email;
    private UserRole role;

    private String firstName;
    private String lastName;
    private String phone;

    private Boolean isActive;
    private Boolean isEmailVerified;
    private String profileImageUrl;
}
