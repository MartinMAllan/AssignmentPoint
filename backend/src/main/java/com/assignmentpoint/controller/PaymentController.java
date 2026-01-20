package com.assignmentpoint.controller;

import com.assignmentpoint.dto.CreateDepositRequest;
import com.assignmentpoint.dto.DepositResponse;
import com.assignmentpoint.dto.PaymentDTO;
import com.assignmentpoint.dto.WalletDTO;
import com.assignmentpoint.entity.Customer;
import com.assignmentpoint.exception.UnauthorizedException;
import com.assignmentpoint.repository.CustomerRepository;
import com.assignmentpoint.security.JwtTokenProvider;
import com.assignmentpoint.service.PaymentService;
import com.assignmentpoint.util.ApiResponse;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomerRepository customerRepository;

    private Long getCustomerIdFromToken(String token) {
        String userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
        Long customerId = customerRepository.findByUserId(Long.parseLong(userId))
                .map(Customer::getId)
                .orElseThrow(() -> new UnauthorizedException("Customer profile not found for this user"));

        System.out.println("[v0] PaymentController: Extracted customerId: " + customerId + " from userId: " + userId);
        return customerId;
    }
    @PostMapping("/deposit/stripe")
    public ResponseEntity<ApiResponse<DepositResponse>> createStripeDeposit(
            @RequestBody CreateDepositRequest request,
            @RequestHeader("Authorization") String token) throws StripeException {

        Long customerId = getCustomerIdFromToken(token);

        DepositResponse response =
                paymentService.createStripeDeposit(customerId, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Stripe payment intent created",
                        response
                )
        );
    }

    @PostMapping("/deposit/paypal")
    public ResponseEntity<ApiResponse<DepositResponse>> createPayPalDeposit(
            @RequestBody CreateDepositRequest request,
            @RequestHeader("Authorization") String token) {

        Long customerId = getCustomerIdFromToken(token);

        DepositResponse response =
                paymentService.createPayPalDeposit(customerId, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "PayPal deposit initiated",
                        response
                )
        );
    }

    @PostMapping("/stripe/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmStripePayment(
            @RequestParam("paymentIntentId") String paymentIntentId)
            throws StripeException {

        paymentService.confirmStripePayment(paymentIntentId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment confirmed successfully",
                        null
                )
        );
    }

    @PostMapping("/paypal/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmPayPalPayment(
            @RequestParam("paypalOrderId") String paypalOrderId) {

        paymentService.confirmPayPalPayment(paypalOrderId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "PayPal payment confirmed successfully",
                        null
                )
        );
    }

    @GetMapping("/wallet/balance")
    public ResponseEntity<ApiResponse<WalletDTO>> getWalletBalance(
            @RequestHeader("Authorization") String token) {

        Long customerId = getCustomerIdFromToken(token);

        WalletDTO wallet =
                paymentService.getWalletBalance(customerId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Wallet balance retrieved",
                        wallet
                )
        );
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentHistory(
            @RequestHeader("Authorization") String token) {

        Long customerId = getCustomerIdFromToken(token);

        List<PaymentDTO> payments =
                paymentService.getPaymentHistory(customerId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Payment history retrieved",
                        payments
                )
        );
    }
}
