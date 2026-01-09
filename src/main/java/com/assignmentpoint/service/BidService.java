package com.assignmentpoint.service;

import com.assignmentpoint.dto.CreateBidRequest;
import com.assignmentpoint.dto.BidDTO;
import com.assignmentpoint.entity.*;
import com.assignmentpoint.exception.BadRequestException;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BidService {
    
    private final OrderBidRepository bidRepository;
    private final OrderRepository orderRepository;
    private final WriterRepository writerRepository;
    
    public BidDTO submitBid(CreateBidRequest request, Long writerId) {
        Order order = orderRepository.findById(request.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        Writer writer = writerRepository.findById(writerId)
            .orElseThrow(() -> new ResourceNotFoundException("Writer not found"));
        
        if (!order.getStatus().equals(Order.OrderStatus.AVAILABLE)) {
            throw new BadRequestException("Order is not available for bidding");
        }
        
        bidRepository.findByOrderIdAndWriterId(order.getId(), writer.getId())
            .ifPresent(bid -> {
                throw new BadRequestException("You have already placed a bid on this order");
            });
        
        OrderBid bid = OrderBid.builder()
            .order(order)
            .writer(writer)
            .bidAmount(order.getTotalAmount())
            .proposedWriterShare(calculateWriterShare(order, writer))
            .coverLetter(request.getCoverLetter())
            .deliveryTime(order.getDeliveryTime())
            .status(OrderBid.BidStatus.PENDING)
            .submittedAt(java.time.LocalDateTime.now())
            .build();
        
        bid = bidRepository.save(bid);
        
        order.setTotalBids(order.getTotalBids() + 1);
        orderRepository.save(order);
        
        writer.setTotalBidsSubmitted(writer.getTotalBidsSubmitted() + 1);
        writerRepository.save(writer);
        
        return convertToDTO(bid);
    }
    
    public List<BidDTO> getBidsForOrder(Long orderId) {
        return bidRepository.findByOrderId(orderId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<BidDTO> getBidsForWriter(Long writerId) {
        return bidRepository.findByWriterId(writerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public BidDTO acceptBid(Long bidId, Long customerId) {
        OrderBid bid = bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        Order order = bid.getOrder();
        if (!order.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Only the order owner can accept bids");
        }
        
        bid.setStatus(OrderBid.BidStatus.ACCEPTED);
        bid = bidRepository.save(bid);
        
        order.setWriter(bid.getWriter());
        order.setWinningBidId(bid.getId());
        order.setStatus(Order.OrderStatus.PENDING);
        orderRepository.save(order);
        
        bid.getWriter().setTotalBidsWon(bid.getWriter().getTotalBidsWon() + 1);
        writerRepository.save(bid.getWriter());
        
        return convertToDTO(bid);
    }
    
    public BidDTO rejectBid(Long bidId, String rejectionReason) {
        OrderBid bid = bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        bid.setStatus(OrderBid.BidStatus.REJECTED);
        bid.setRejectionReason(rejectionReason);
        bid = bidRepository.save(bid);
        
        return convertToDTO(bid);
    }
    
    private java.math.BigDecimal calculateWriterShare(Order order, Writer writer) {
        boolean isReturningCustomer = order.getCustomerIsReturning();
        java.math.BigDecimal percentage = isReturningCustomer 
            ? java.math.BigDecimal.valueOf(45) 
            : java.math.BigDecimal.valueOf(40);
        
        return order.getTotalAmount()
            .multiply(percentage)
            .divide(java.math.BigDecimal.valueOf(100));
    }
    
    private BidDTO convertToDTO(OrderBid bid) {
        return BidDTO.builder()
            .id(bid.getId())
            .orderId(bid.getOrder().getId())
            .writerId(bid.getWriter().getId())
            .writerName(bid.getWriter().getUser().getFirstName() + " " + bid.getWriter().getUser().getLastName())
            .bidAmount(bid.getBidAmount())
            .proposedWriterShare(bid.getProposedWriterShare())
            .coverLetter(bid.getCoverLetter())
            .status(bid.getStatus())
            .submittedAt(bid.getSubmittedAt())
            .build();
    }
}
