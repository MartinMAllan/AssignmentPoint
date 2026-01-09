package com.assignmentpoint.controller;

import com.assignmentpoint.dto.TransactionDTO;
import com.assignmentpoint.service.TransactionService;
import com.assignmentpoint.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getUserTransactions(@PathVariable Long userId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Transactions retrieved", transactions));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getOrderTransactions(@PathVariable Long orderId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByOrder(orderId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Transactions retrieved", transactions));
    }
}
