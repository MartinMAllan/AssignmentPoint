package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByUserId(Long userId, Pageable pageable);
    List<Transaction> findByOrderId(Long orderId);
    Page<Transaction> findByTransactionType(Transaction.TransactionType type, Pageable pageable);
    Page<Transaction> findByStatus(Transaction.TransactionStatus status, Pageable pageable);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = :type AND t.status = 'COMPLETED'")
    BigDecimal sumAmountByUserIdAndType(Long userId, Transaction.TransactionType type);
}
