package com.assignmentpoint.controller;

import com.assignmentpoint.dto.TransactionDTO;
import com.assignmentpoint.service.TransactionService;
import com.assignmentpoint.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionDTO>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDTO> transactions = transactionService.getUserTransactions(getCurrentUserId(), pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Transactions retrieved successfully", transactions));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<TransactionDTO>>> getUserTransactions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDTO> transactions = transactionService.getUserTransactions(userId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "User transactions retrieved successfully", transactions));
    }

    private Long getCurrentUserId() {
        // This should be implemented to extract from JWT token
        return 1L;
    }
}
