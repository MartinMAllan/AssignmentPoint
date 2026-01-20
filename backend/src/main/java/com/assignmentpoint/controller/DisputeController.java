package com.assignmentpoint.controller;

import com.assignmentpoint.dto.OrderDTO;
import com.assignmentpoint.service.DisputeService;
import com.assignmentpoint.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/disputes")
@CrossOrigin(origins = "*")
public class DisputeController {

    @Autowired
    private DisputeService disputeService;

    @GetMapping("/counts")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getDisputeCounts() {
        Map<String, Integer> counts = disputeService.getDisputeCounts();
        return ResponseEntity.ok(ApiResponse.success("Dispute counts retrieved", counts));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getActiveDisputes() {
        List<OrderDTO> disputes = disputeService.getActiveDisputes();
        return ResponseEntity.ok(ApiResponse.success("Active disputes retrieved", disputes));
    }

    @PatchMapping("/{orderId}/resolve")
    public ResponseEntity<ApiResponse<OrderDTO>> resolveDispute(@PathVariable Long orderId) {
        OrderDTO dispute = disputeService.resolveDispute(orderId);
        return ResponseEntity.ok(ApiResponse.success("Dispute resolved", dispute));
    }

    @GetMapping("/by-status")
    public ResponseEntity<ApiResponse<Map<String, List<OrderDTO>>>> getDisputesByStatus() {
        Map<String, List<OrderDTO>> disputes = disputeService.getDisputesByStatus();
        return ResponseEntity.ok(ApiResponse.success("Disputes by status retrieved", disputes));
    }
}
