package com.assignmentpoint.service;

import com.assignmentpoint.dto.*;
import com.assignmentpoint.entity.*;
import com.assignmentpoint.exception.BadRequestException;
import com.assignmentpoint.exception.UnauthorizedException;
import com.assignmentpoint.mapper.UserMapper;
import com.assignmentpoint.repository.*;
import com.assignmentpoint.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final WriterRepository writerRepository;
    private final CustomerRepository customerRepository;
    private final SalesAgentRepository salesAgentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(User.UserRole.valueOf(request.getRole().toUpperCase()))
                .isActive(true)
                .isEmailVerified(false)
                .build();

        user = userRepository.save(user);
        System.out.println("[v0] AuthService: User created with ID: " + user.getId() + ", role: " + user.getRole());

        // Create role-specific entity
        createRoleSpecificEntity(user, request);

        String token = jwtTokenProvider.generateToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .user(UserMapper.toResponse(user))
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is inactive");
        }

        String token = jwtTokenProvider.generateToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .user(UserMapper.toResponse(user))
                .message("Login successful")
                .build();
    }

    @Transactional
    public void createRoleSpecificEntity(User user, RegisterRequest request) {
        try {
            switch (user.getRole()) {
                case WRITER:
                    System.out.println("[v0] AuthService: Creating Writer record");
                    Writer writer = Writer.builder().user(user).build();
                    writerRepository.save(writer);
                    System.out.println("[v0] AuthService: Writer created successfully");
                    break;

                case CUSTOMER:
                    System.out.println("[v0] AuthService: Creating Customer record");
                    SalesAgent salesAgent = null;
                    if (request.getReferralCode() != null && !request.getReferralCode().isEmpty()) {
                        System.out.println("[v0] AuthService: Looking up referral code: " + request.getReferralCode());
                        salesAgent = salesAgentRepository.findByReferralCode(request.getReferralCode())
                                .orElse(null);
                    }

                    Customer customer = Customer.builder()
                            .user(user)
                            .salesAgent(salesAgent)
                            .referralCodeUsed(request.getReferralCode())
                            .build();
                    customerRepository.save(customer);
                    System.out.println("[v0] AuthService: Customer created successfully");

                    if (salesAgent != null) {
                        System.out.println("[v0] AuthService: Updating sales agent referral stats");
                        salesAgent.setTotalReferrals(salesAgent.getTotalReferrals() + 1);
                        salesAgent.setActiveCustomers(salesAgent.getActiveCustomers() + 1);
                        salesAgentRepository.save(salesAgent);
                    }
                    break;

                case SALES_AGENT:
                    System.out.println("[v0] AuthService: Creating SalesAgent record");
                    String referralCode = generateReferralCode();
                    SalesAgent agent = SalesAgent.builder()
                            .user(user)
                            .referralCode(referralCode)
                            .build();
                    salesAgentRepository.save(agent);
                    System.out.println("[v0] AuthService: SalesAgent created with code: " + referralCode);
                    break;

//                case MANAGER:
                case ADMIN:
                case EDITOR:
                    System.out.println("[v0] AuthService: Role " + user.getRole() + " does not require additional entity creation");
                    break;

                default:
                    System.out.println("[v0] AuthService: Unknown role: " + user.getRole());
            }
        } catch (Exception e) {
            System.err.println("[v0] AuthService: Error creating role-specific entity: " + e.getMessage());
            e.printStackTrace();
            throw new BadRequestException("Failed to create user profile: " + e.getMessage());
        }
    }

    private String generateReferralCode() {
        String code;
        do {
            code = "REF" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (salesAgentRepository.existsByReferralCode(code));
        return code;
    }
}
