package com.assignmentpoint.repository;

import com.assignmentpoint.entity.OrderBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderBidRepository extends JpaRepository<OrderBid, Long> {
    List<OrderBid> findByOrderId(Long orderId);
    List<OrderBid> findByWriterId(Long writerId);
    List<OrderBid> findByStatus(OrderBid.BidStatus status);
    Optional<OrderBid> findByOrderIdAndWriterId(Long orderId, Long writerId);
    List<OrderBid> findByOrderIdAndStatus(Long orderId, OrderBid.BidStatus status);
}
