package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    private String firstName;
    private String lastName;
    private String phone;
    
    @Column(columnDefinition = "boolean default true")
    private Boolean isActive = true;
    
    @Column(columnDefinition = "boolean default false")
    private Boolean isEmailVerified = false;
    
    private String profileImageUrl;
    private LocalDateTime lastLoginAt;
    
    public enum UserRole {
        WRITER, ADMIN, WRITER_MANAGER, CUSTOMER, SALES_AGENT, EDITOR
    }
}
