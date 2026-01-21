package com.assignmentpoint.service;

import com.assignmentpoint.dto.CreateDepositRequest;
import com.assignmentpoint.dto.DepositResponse;
import com.assignmentpoint.dto.PaymentDTO;
import com.assignmentpoint.dto.WalletDTO;
import com.assignmentpoint.entity.*;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.CustomerRepository;
import com.assignmentpoint.repository.PaymentRepository;
import com.assignmentpoint.repository.WalletTransactionRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Transactional
    public DepositResponse createStripeDeposit(Long customerId, CreateDepositRequest request) throws StripeException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        // Create Stripe PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(request.getAmount().multiply(BigDecimal.valueOf(100)).longValue()) // Convert to cents
                .setCurrency("usd")
                .setDescription("Wallet Deposit - " + (request.getDescription() != null ? request.getDescription() : ""))
                .putMetadata("customerId", customerId.toString())
                .putMetadata("customerEmail", customer.getUser().getEmail())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // Create payment record
        Payment payment = Payment.builder()
                .customer(customer)
                .paymentMethod(Payment.PaymentMethod.STRIPE)
                .paymentType(Payment.PaymentType.CARD)
                .amount(request.getAmount())
                .status(Payment.PaymentStatus.PENDING)
                .stripePaymentIntentId(paymentIntent.getId())
                .description(request.getDescription())
                .build();

        paymentRepository.save(payment);

        return DepositResponse.builder()
                .paymentId(payment.getId())
                .status("PENDING")
                .amount(request.getAmount())
                .clientSecret(paymentIntent.getClientSecret())
                .message("Stripe payment intent created successfully")
                .build();
    }

    @Transactional
    public void confirmStripePayment(String paymentIntentId) throws StripeException {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

        if ("succeeded".equals(paymentIntent.getStatus())) {
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            String latestChargeId = paymentIntent.getLatestCharge();
            if (latestChargeId != null) {
                payment.setStripeChargeId(latestChargeId);
            }
            paymentRepository.save(payment);

            addFundsToWallet(payment.getCustomer(), payment.getAmount(), payment.getId(), "DEPOSIT");
        } else if ("payment_failed".equals(paymentIntent.getStatus())) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            if (paymentIntent.getLastPaymentError() != null) {
                payment.setErrorMessage("Payment failed: " + paymentIntent.getLastPaymentError().getMessage());
            } else {
                payment.setErrorMessage("Payment failed: Unknown error");
            }
            paymentRepository.save(payment);
        }
    }

    @Transactional
    public DepositResponse createPayPalDeposit(Long customerId, CreateDepositRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        Payment payment = Payment.builder()
                .customer(customer)
                .paymentMethod(Payment.PaymentMethod.PAYPAL)
                .paymentType(Payment.PaymentType.PAYPAL_WALLET)
                .amount(request.getAmount())
                .status(Payment.PaymentStatus.PENDING)
                .description(request.getDescription())
                .build();

        paymentRepository.save(payment);

        String paypalRedirectUrl = String.format(
                "/api/payments/paypal/create-order?paymentId=%d&amount=%.2f",
                payment.getId(),
                request.getAmount()
        );

        return DepositResponse.builder()
                .paymentId(payment.getId())
                .status("PENDING")
                .amount(request.getAmount())
                .redirectUrl(paypalRedirectUrl)
                .message("PayPal order created successfully")
                .build();
    }

    @Transactional
    public void confirmPayPalPayment(String paypalOrderId) {
        Payment payment = paymentRepository.findByPaypalOrderId(paypalOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        // Update customer wallet
        addFundsToWallet(payment.getCustomer(), payment.getAmount(), payment.getId(), "DEPOSIT");
    }

    @Transactional
    public void addFundsToWallet(Customer customer, BigDecimal amount, Long referenceId, String description) {
        BigDecimal balanceBefore = customer.getWalletBalance() != null ? customer.getWalletBalance() : BigDecimal.ZERO;
        BigDecimal balanceAfter = balanceBefore.add(amount);

        customer.setWalletBalance(balanceAfter);
        customer.setTotalDeposited((customer.getTotalDeposited() != null ? customer.getTotalDeposited() : BigDecimal.ZERO).add(amount));
        customer.setLastDepositDate(LocalDateTime.now());
        customerRepository.save(customer);

        // Create wallet transaction record
        WalletTransaction transaction = WalletTransaction.builder()
                .customer(customer)
                .transactionType(WalletTransaction.TransactionType.DEPOSIT)
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .description(description)
                .referenceId(referenceId.toString())
                .build();

        walletTransactionRepository.save(transaction);
    }

    @Transactional
    public void withdrawFundsFromWallet(Customer customer, BigDecimal amount, String reason, Long referenceId) {
        BigDecimal balanceBefore = customer.getWalletBalance() != null ? customer.getWalletBalance() : BigDecimal.ZERO;

        if (balanceBefore.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient wallet balance");
        }

        BigDecimal balanceAfter = balanceBefore.subtract(amount);
        customer.setWalletBalance(balanceAfter);
        customerRepository.save(customer);

        WalletTransaction transaction = WalletTransaction.builder()
                .customer(customer)
                .transactionType(WalletTransaction.TransactionType.WITHDRAWAL)
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .description(reason)
                .referenceId(referenceId.toString())
                .build();

        walletTransactionRepository.save(transaction);
    }

    public WalletDTO getWalletBalance(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return WalletDTO.builder()
                .customerId(customerId)
                .balance(customer.getWalletBalance() != null ? customer.getWalletBalance() : BigDecimal.ZERO)
                .totalDeposited(customer.getTotalDeposited() != null ? customer.getTotalDeposited() : BigDecimal.ZERO)
                .build();
    }

    public List<PaymentDTO> getPaymentHistory(Long customerId) {
        return paymentRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PaymentDTO convertToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .customerId(payment.getCustomer().getId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentType(payment.getPaymentType())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .stripePaymentIntentId(payment.getStripePaymentIntentId())
                .paypalOrderId(payment.getPaypalOrderId())
                .description(payment.getDescription())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
