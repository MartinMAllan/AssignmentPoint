package com.assignmentpoint.repository;

import com.assignmentpoint.entity.OrderBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderBidRepository extends JpaRepository<OrderBid, Long> {
    Optional<OrderBid> findByOrderIdAndWriterId(Long orderId, Long writerId);
    List<OrderBid> findByOrderId(Long orderId);
    List<OrderBid> findByWriterId(Long writerId);
    List<OrderBid> findByOrderIdAndStatus(Long orderId, OrderBid.BidStatus status);
    
    @Query("SELECT ob FROM OrderBid ob WHERE ob.order.id = :orderId ORDER BY ob.bidAmount ASC")
    List<OrderBid> findBidsByOrderSortedByPrice(@Param("orderId") Long orderId);
}
