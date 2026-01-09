package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);
    Page<Order> findByWriterId(Long writerId, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'AVAILABLE' ORDER BY o.createdAt DESC")
    Page<Order> findAvailableOrders(Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'AVAILABLE' AND " +
           "(LOWER(o.subject) LIKE LOWER(CONCAT('%', :subject, '%')) OR " +
           "LOWER(o.educationLevel) LIKE LOWER(CONCAT('%', :educationLevel, '%')))")
    Page<Order> findBySubjectAndEducationLevel(
        @Param("subject") String subject,
        @Param("educationLevel") String educationLevel,
        Pageable pageable
    );
    
    List<Order> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByStatusAndIsOverdue(Order.OrderStatus status, Boolean isOverdue);
}
