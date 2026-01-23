package com.assignmentpoint.controller;

import com.assignmentpoint.dto.BidDTO;
import com.assignmentpoint.dto.CreateBidRequest;
import com.assignmentpoint.entity.Customer;
import com.assignmentpoint.entity.Writer;
import com.assignmentpoint.exception.UnauthorizedException;
import com.assignmentpoint.repository.WriterRepository;
import com.assignmentpoint.service.BidService;
import com.assignmentpoint.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bids")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class BidController {

    private final BidService bidService;
    private final WriterRepository writerRepository;

    public Long getWriterIdByUserId(Long userId) {
        return writerRepository.findByUserId(userId)
                .map(Writer::getId)
                .orElseThrow(() -> new UnauthorizedException(
                        "Writer profile not found for user with ID: " + userId));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<BidDTO>> submitBid(@RequestBody CreateBidRequest request) {
        BidDTO bid = bidService.submitBid(request);
        return ResponseEntity.ok(ApiResponse.success("Bid submitted successfully", bid));
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<BidDTO>>> getBidsByOrder(@PathVariable Long orderId) {
        List<BidDTO> bids = bidService.getBidsByOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("Order bids retrieved", bids));
    }
    
    @GetMapping("/writer/{writerId}")
    public ResponseEntity<ApiResponse<List<BidDTO>>> getBidsByWriter(@PathVariable Long writerId) {
        Long writerId1 = getWriterIdByUserId(writerId);
        List<BidDTO> bids = bidService.getBidsByWriter(writerId1);
        return ResponseEntity.ok(ApiResponse.success("Writer bids retrieved", bids));
    }
    
    @PostMapping("/{bidId}/accept")
    public ResponseEntity<ApiResponse<BidDTO>> acceptBid(@PathVariable Long bidId) {
        BidDTO bid = bidService.acceptBid(bidId);
        return ResponseEntity.ok(ApiResponse.success("Bid accepted", bid));
    }

    // Admin endpoints for bid management
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<BidDTO>>> getAllBids(
            @RequestParam(required = false) String status) {
        List<BidDTO> bids = bidService.getAllBids(status);
        return ResponseEntity.ok(ApiResponse.success("All bids retrieved", bids));
    }

    @GetMapping("/admin/pending")
    public ResponseEntity<ApiResponse<List<BidDTO>>> getPendingBids() {
        List<BidDTO> bids = bidService.getAllBids("PENDING");
        return ResponseEntity.ok(ApiResponse.success("Pending bids retrieved", bids));
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
