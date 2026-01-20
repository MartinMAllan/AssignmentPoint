package com.assignmentpoint.controller;

import com.assignmentpoint.dto.UserStatsDTO;
import com.assignmentpoint.entity.User;
import com.assignmentpoint.service.UserStatsService;
import com.assignmentpoint.service.UserService;
import com.assignmentpoint.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserStatsService userStatsService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers(@RequestParam(required = false) String role) {
        List<User> users;
        if (role != null && !role.isEmpty()) {
            try {
                users = userService.getUsersByRole(User.UserRole.valueOf(role.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // If role is invalid, return all users
                users = userService.getAllUsers();
            }
        } else {
            users = userService.getAllUsers();
        }
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<ApiResponse<UserStatsDTO>> getUserStats(@PathVariable Long userId) {
        UserStatsDTO stats = userStatsService.getUserStats(userId);
        return ResponseEntity.ok(ApiResponse.success("User stats retrieved", stats));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User retrieved", user));
    }

    @PatchMapping("/{userId}/deactivate")
    public ResponseEntity<ApiResponse<User>> deactivateUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        user.setIsActive(false);
        userService.updateUser(userId, user);
        return ResponseEntity.ok(ApiResponse.success("User deactivated", user));
    }

    @PatchMapping("/{userId}/activate")
    public ResponseEntity<ApiResponse<User>> activateUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        user.setIsActive(true);
        userService.updateUser(userId, user);
        return ResponseEntity.ok(ApiResponse.success("User activated", user));
    }
}
