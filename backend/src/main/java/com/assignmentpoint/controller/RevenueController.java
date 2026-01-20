package com.assignmentpoint.controller;

import com.assignmentpoint.dto.TransactionDTO;
import com.assignmentpoint.service.RevenueService;
import com.assignmentpoint.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/revenue")
@CrossOrigin(origins = "*")
public class RevenueController {

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueMetrics() {
        Map<String, Object> metrics = revenueService.getRevenueMetrics();
        return ResponseEntity.ok(ApiResponse.success("Revenue metrics retrieved", metrics));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit) {
        List<TransactionDTO> transactions = revenueService.getRecentTransactions(limit);
        return ResponseEntity.ok(ApiResponse.success("Recent transactions retrieved", transactions));
    }

    @GetMapping("/breakdown")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueBreakdown() {
        Map<String, Object> breakdown = revenueService.getRevenueBreakdown();
        return ResponseEntity.ok(ApiResponse.success("Revenue breakdown retrieved", breakdown));
    }
}
