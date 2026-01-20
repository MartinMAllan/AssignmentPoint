package com.assignmentpoint.repository;

import com.assignmentpoint.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<WalletTransaction> findByCustomerIdAndTransactionType(Long customerId, WalletTransaction.TransactionType transactionType);
}
