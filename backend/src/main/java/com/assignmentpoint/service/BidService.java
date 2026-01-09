package com.assignmentpoint.service;

import com.assignmentpoint.dto.BidDTO;
import com.assignmentpoint.dto.CreateBidRequest;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.entity.OrderBid;
import com.assignmentpoint.entity.Writer;
import com.assignmentpoint.exception.BadRequestException;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.OrderBidRepository;
import com.assignmentpoint.repository.OrderRepository;
import com.assignmentpoint.repository.WriterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BidService {
    
    @Autowired
    private OrderBidRepository bidRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private WriterRepository writerRepository;
    
    @Transactional
    public BidDTO submitBid(Long writerId, CreateBidRequest request) {
        Writer writer = writerRepository.findById(writerId)
            .orElseThrow(() -> new ResourceNotFoundException("Writer not found"));
        
        Order order = orderRepository.findById(request.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getStatus() != Order.OrderStatus.AVAILABLE) {
            throw new BadRequestException("Order is not available for bidding");
        }
        
        if (bidRepository.findByOrderIdAndWriterId(order.getId(), writerId).isPresent()) {
            throw new BadRequestException("You have already bid on this order");
        }
        
        BigDecimal bidAmount = order.getTotalAmount().multiply(BigDecimal.valueOf(0.75));
        
        OrderBid bid = OrderBid.builder()
            .order(order)
            .writer(writer)
            .bidAmount(bidAmount)
            .deliveryHours(order.getDeliveryTime() != null ? order.getDeliveryTime() : 72)
            .coverLetter(request.getCoverLetter())
            .status(OrderBid.BidStatus.PENDING)
            .submittedAt(LocalDateTime.now())
            .build();
        
        bid = bidRepository.save(bid);
        
        order.setTotalBids(order.getTotalBids() + 1);
        orderRepository.save(order);
        
        return convertToDTO(bid);
    }
    
    public List<BidDTO> getBidsByOrder(Long orderId) {
        return bidRepository.findByOrderId(orderId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<BidDTO> getBidsByWriter(Long writerId) {
        return bidRepository.findByWriterId(writerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public BidDTO acceptBid(Long bidId) {
        OrderBid bid = bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        Order order = bid.getOrder();
        
        List<OrderBid> otherBids = bidRepository.findByOrderId(order.getId());
        for (OrderBid otherBid : otherBids) {
            if (!otherBid.getId().equals(bidId) && otherBid.getStatus() == OrderBid.BidStatus.PENDING) {
                otherBid.setStatus(OrderBid.BidStatus.REJECTED);
                bidRepository.save(otherBid);
            }
        }
        
        bid.setStatus(OrderBid.BidStatus.ACCEPTED);
        bid = bidRepository.save(bid);
        
        order.setWriter(bid.getWriter());
        order.setWriterManager(bid.getWriter().getWriterManager());
        order.setWinningBidId(bidId);
        order.setStatus(Order.OrderStatus.IN_PROGRESS);
        order.setStartedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        return convertToDTO(bid);
    }
    
    @Transactional
    public void rejectBid(Long bidId) {
        OrderBid bid = bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        bid.setStatus(OrderBid.BidStatus.REJECTED);
        bidRepository.save(bid);
    }
    
    @Transactional
    public void withdrawBid(Long bidId) {
        OrderBid bid = bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        if (bid.getStatus() != OrderBid.BidStatus.PENDING) {
            throw new BadRequestException("Only pending bids can be withdrawn");
        }
        
        Order order = bid.getOrder();
        order.setTotalBids(order.getTotalBids() - 1);
        orderRepository.save(order);
        
        bid.setStatus(OrderBid.BidStatus.WITHDRAWN);
        bidRepository.save(bid);
    }
    
    private BidDTO convertToDTO(OrderBid bid) {
        return BidDTO.builder()
            .id(bid.getId())
            .orderId(bid.getOrder().getId())
            .writerId(bid.getWriter().getId())
            .writerName(bid.getWriter().getUser().getFirstName() + " " + bid.getWriter().getUser().getLastName())
            .writerRating(bid.getWriter().getRating())
            .writerCompletedOrders(bid.getWriter().getTotalOrdersCompleted())
            .bidAmount(bid.getBidAmount())
            .currency(bid.getCurrency())
            .deliveryHours(bid.getDeliveryHours())
            .coverLetter(bid.getCoverLetter())
            .status(bid.getStatus().name())
            .submittedAt(bid.getSubmittedAt())
            .build();
    }
}
