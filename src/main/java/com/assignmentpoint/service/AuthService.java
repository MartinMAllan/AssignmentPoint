package com.assignmentpoint.service;

import com.assignmentpoint.dto.LoginRequest;
import com.assignmentpoint.dto.RegisterRequest;
import com.assignmentpoint.dto.AuthResponse;
import com.assignmentpoint.entity.*;
import com.assignmentpoint.exception.BadRequestException;
import com.assignmentpoint.exception.UnauthorizedException;
import com.assignmentpoint.repository.*;
import com.assignmentpoint.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final WriterRepository writerRepository;
    private final CustomerRepository customerRepository;
    private final SalesAgentRepository salesAgentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        
        User user = User.builder()
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .role(request.getRole())
            .isActive(true)
            .isEmailVerified(false)
            .build();
        
        user = userRepository.save(user);
        
        // Create role-specific entities
        switch (request.getRole()) {
            case WRITER -> {
                Writer writer = Writer.builder()
                    .user(user)
                    .rating(0.0)
                    .totalOrdersCompleted(0)
                    .availabilityStatus(Writer.AvailabilityStatus.AVAILABLE)
                    .build();
                writerRepository.save(writer);
            }
            case CUSTOMER -> {
                Customer customer = Customer.builder()
                    .user(user)
                    .isReturning(false)
                    .totalOrders(0)
                    .build();
                customerRepository.save(customer);
            }
            case SALES_AGENT -> {
                SalesAgent agent = SalesAgent.builder()
                    .user(user)
                    .referralCode(generateReferralCode())
                    .totalReferrals(0)
                    .activeCustomers(0)
                    .build();
                salesAgentRepository.save(agent);
            }
            default -> {}
        }
        
        String token = jwtProvider.generateToken(user.getEmail(), user.getRole().toString());
        
        return AuthResponse.builder()
            .token(token)
            .userId(user.getId())
            .email(user.getEmail())
            .role(user.getRole())
            .message("Registration successful")
            .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is inactive");
        }
        
        String token = jwtProvider.generateToken(user.getEmail(), user.getRole().toString());
        
        return AuthResponse.builder()
            .token(token)
            .userId(user.getId())
            .email(user.getEmail())
            .role(user.getRole())
            .message("Login successful")
            .build();
    }
    
    private String generateReferralCode() {
        return "SA_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
    }
}
