package com.assignmentpoint.controller;

import com.assignmentpoint.dto.CreateBidRequest;
import com.assignmentpoint.dto.BidDTO;
import com.assignmentpoint.service.BidService;
import com.assignmentpoint.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/bids")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class BidController {
    
    private final BidService bidService;
    
    @PostMapping
    @PreAuthorize("hasRole('WRITER')")
    public ResponseEntity<ApiResponse<BidDTO>> submitBid(
        @Valid @RequestBody CreateBidRequest request,
        @RequestAttribute("userId") Long writerId) {
        BidDTO bid = bidService.submitBid(request, writerId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "Bid submitted successfully", bid));
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<BidDTO>>> getBidsForOrder(@PathVariable Long orderId) {
        List<BidDTO> bids = bidService.getBidsForOrder(orderId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bids retrieved", bids));
    }
    
    @GetMapping("/writer/{writerId}")
    public ResponseEntity<ApiResponse<List<BidDTO>>> getBidsForWriter(@PathVariable Long writerId) {
        List<BidDTO> bids = bidService.getBidsForWriter(writerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Writer bids retrieved", bids));
    }
    
    @PatchMapping("/{bidId}/accept")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<BidDTO>> acceptBid(
        @PathVariable Long bidId,
        @RequestAttribute("userId") Long customerId) {
        BidDTO bid = bidService.acceptBid(bidId, customerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bid accepted", bid));
    }
    
    @PatchMapping("/{bidId}/reject")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<BidDTO>> rejectBid(
        @PathVariable Long bidId,
        @RequestParam String rejectionReason) {
        BidDTO bid = bidService.rejectBid(bidId, rejectionReason);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bid rejected", bid));
    }
}
