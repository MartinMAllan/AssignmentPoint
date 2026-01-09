package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByWriterId(Long writerId);
    List<Order> findByEditorId(Long editorId);
    List<Order> findBySalesAgentId(Long salesAgentId);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'AVAILABLE' ORDER BY o.createdAt DESC")
    List<Order> findAvailableOrders();
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.writer.id = :writerId AND o.status = 'COMPLETED'")
    Integer countCompletedOrdersByWriter(Long writerId);
}
