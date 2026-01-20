package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByCustomerId(Long customerId);

    List<Payment> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);

    Optional<Payment> findByPaypalOrderId(String paypalOrderId);

    @Query("SELECT p FROM Payment p WHERE p.customer.id = :customerId AND p.status = 'COMPLETED' ORDER BY p.createdAt DESC")
    List<Payment> findCompletedPaymentsByCustomer(@Param("customerId") Long customerId);

    @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' AND p.createdAt < :cutoffTime")
    List<Payment> findExpiredPendingPayments(@Param("cutoffTime") LocalDateTime cutoffTime);
}
