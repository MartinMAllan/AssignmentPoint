package com.assignmentpoint.service;

import com.assignmentpoint.dto.TransactionDTO;
import com.assignmentpoint.entity.Transaction;
import com.assignmentpoint.entity.User;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.TransactionRepository;
import com.assignmentpoint.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    
    public TransactionDTO createTransaction(Long userId, Transaction.TransactionType type, 
                                          BigDecimal amount, String description) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Transaction transaction = Transaction.builder()
            .user(user)
            .transactionType(type)
            .amount(amount)
            .description(description)
            .status(Transaction.TransactionStatus.COMPLETED)
            .build();
        
        transaction = transactionRepository.save(transaction);
        return convertToDTO(transaction);
    }
    
    public Page<TransactionDTO> getUserTransactions(Long userId, Pageable pageable) {
        return transactionRepository.findByUserId(userId, pageable)
            .map(this::convertToDTO);
    }
    
    public Page<TransactionDTO> getTransactionsByType(Transaction.TransactionType type, Pageable pageable) {
        return transactionRepository.findByTransactionType(type, pageable)
            .map(this::convertToDTO);
    }
    
    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
            .id(transaction.getId())
            .userId(transaction.getUser().getId())
            .transactionType(transaction.getTransactionType())
            .amount(transaction.getAmount())
            .currency(transaction.getCurrency())
            .description(transaction.getDescription())
            .status(transaction.getStatus())
            .createdAt(transaction.getCreatedAt())
            .build();
    }
}
