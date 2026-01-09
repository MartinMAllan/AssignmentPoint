package com.assignmentpoint.controller;

import com.assignmentpoint.dto.BidDTO;
import com.assignmentpoint.dto.CreateBidRequest;
import com.assignmentpoint.service.BidService;
import com.assignmentpoint.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "*")
public class BidController {
    
    @Autowired
    private BidService bidService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<BidDTO>> submitBid(
            @RequestParam Long writerId,
            @Valid @RequestBody CreateBidRequest request) {
        BidDTO bid = bidService.submitBid(writerId, request);
        return ResponseEntity.ok(ApiResponse.success("Bid submitted successfully", bid));
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<BidDTO>>> getBidsByOrder(@PathVariable Long orderId) {
        List<BidDTO> bids = bidService.getBidsByOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("Order bids retrieved", bids));
    }
    
    @GetMapping("/writer/{writerId}")
    public ResponseEntity<ApiResponse<List<BidDTO>>> getBidsByWriter(@PathVariable Long writerId) {
        List<BidDTO> bids = bidService.getBidsByWriter(writerId);
        return ResponseEntity.ok(ApiResponse.success("Writer bids retrieved", bids));
    }
    
    @PostMapping("/{bidId}/accept")
    public ResponseEntity<ApiResponse<BidDTO>> acceptBid(@PathVariable Long bidId) {
        BidDTO bid = bidService.acceptBid(bidId);
        return ResponseEntity.ok(ApiResponse.success("Bid accepted", bid));
    }
    
    @PostMapping("/{bidId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectBid(@PathVariable Long bidId) {
        bidService.rejectBid(bidId);
        return ResponseEntity.ok(ApiResponse.success("Bid rejected", null));
    }
    
    @PostMapping("/{bidId}/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdrawBid(@PathVariable Long bidId) {
        bidService.withdrawBid(bidId);
        return ResponseEntity.ok(ApiResponse.success("Bid withdrawn", null));
    }
}
