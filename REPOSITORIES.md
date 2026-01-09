# Repository Interfaces

All repositories extend JpaRepository and provide basic CRUD operations plus custom queries.

## UserRepository.java

```java
package com.writersadmin.repository;

import com.writersadmin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByEmail(String email);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByIsActive(Boolean isActive);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = true")
    List<User> findActiveUsersByRole(User.UserRole role);
    
    Long countByRole(User.UserRole role);
}
```

## WriterRepository.java

```java
package com.writersadmin.repository;

import com.writersadmin.entity.Writer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WriterRepository extends JpaRepository<Writer, Long> {
    
    Optional<Writer> findByUserId(Long userId);
    
    List<Writer> findByAvailabilityStatus(Writer.AvailabilityStatus status);
    
    List<Writer> findByWriterManagerId(Long managerId);
    
    @Query("SELECT w FROM Writer w WHERE w.rating >= :minRating ORDER BY w.rating DESC")
    List<Writer> findTopRatedWriters(Double minRating);
    
    @Query("SELECT w FROM Writer w WHERE :specialization MEMBER OF w.specializations")
    List<Writer> findBySpecialization(String specialization);
    
    @Query("SELECT COUNT(w) FROM Writer w WHERE w.availabilityStatus = 'available'")
    Long countAvailableWriters();
}
```

## CustomerRepository.java

```java
package com.writersadmin.repository;

import com.writersadmin.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByUserId(Long userId);
    
    List<Customer> findBySalesAgentId(Long salesAgentId);
    
    List<Customer> findByIsReturning(Boolean isReturning);
    
    Optional<Customer> findByReferralCodeUsed(String referralCode);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.salesAgent.id = :salesAgentId")
    Long countBySalesAgentId(Long salesAgentId);
    
    @Query("SELECT c FROM Customer c WHERE c.isReturning = true AND c.totalOrders > :minOrders")
    List<Customer> findReturningCustomersWithMinOrders(Integer minOrders);
}
```

## SalesAgentRepository.java

```java
package com.writersadmin.repository;

import com.writersadmin.entity.SalesAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalesAgentRepository extends JpaRepository<SalesAgent, Long> {
    
    Optional<SalesAgent> findByUserId(Long userId);
    
    Optional<SalesAgent> findByReferralCode(String referralCode);
    
    Boolean existsByReferralCode(String referralCode);
    
    @Query("SELECT SUM(sa.totalReferrals) FROM SalesAgent sa")
    Long getTotalReferrals();
}
```

## OrderRepository.java

```java
package com.writersadmin.repository;

import com.writersadmin.entity.Order;
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
    
    List<Order> findByCustomerId(Long customerId);
    
    List<Order> findByWriterId(Long writerId);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByCustomerIdAndStatus(Long customerId, Order.OrderStatus status);
    
    List<Order> findByWriterIdAndStatus(Long writerId, Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.subject = :subject")
    List<Order> findByStatusAndSubject(@Param("status") Order.OrderStatus status, @Param("subject") String subject);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'available' ORDER BY o.createdAt DESC")
    List<Order> findAvailableOrders();
    
    @Query("SELECT o FROM Order o WHERE o.deadline < :deadline AND o.status IN ('in_progress', 'in_review')")
    List<Order> findOverdueOrders(@Param("deadline") LocalDateTime deadline);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.writer.id = :writerId AND o.status IN ('in_progress', 'in_review', 'revision')")
    List<Order> findActiveOrdersByWriter(@Param("writerId") Long writerId);
    
    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId ORDER BY o.createdAt DESC")
    List<Order> findCustomerOrdersOrderByDate(@Param("customerId") Long customerId);
}
```

## OrderBidRepository.java

```java
package com.writersadmin.repository;

import com.writersadmin.entity.OrderBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderBidRepository extends JpaRepository<OrderBid, Long> {
    
    List<OrderBid> findByOrderId(Long orderId);
    
    List<OrderBid> findByWriterId(Long writerId);
    
    List<OrderBid> findByStatus(OrderBid.BidStatus status);
    
    Optional<OrderBid> findByOrderIdAndWriterId(Long orderId, Long writerId);
    
    @Query("SELECT ob FROM OrderBid ob WHERE ob.order.id = :orderId AND ob.status = :status")
    List<OrderBid> findByOrderIdAndStatus(@Param("orderId") Long orderId, @Param("status") OrderBid.BidStatus status);
    
    @Query("SELECT ob FROM OrderBid ob WHERE ob.writer.id = :writerId AND ob.status = :status")
    List<OrderBid> findByWriterIdAndStatus(@Param("writerId") Long writerId, @Param("status") OrderBid.BidStatus status);
    
    @Query("SELECT COUNT(ob) FROM OrderBid ob WHERE ob.order.id = :orderId AND ob.status = 'pending'")
    Long countPendingBidsByOrderId(@Param("orderId") Long orderId);
    
    @Query("SELECT COUNT(ob) FROM OrderBid ob WHERE ob.writer.id = :writerId AND ob.status = 'accepted'")
    Long countAcceptedBidsByWriterId(@Param("writerId") Long writerId);
}
```

## MessageRepository.java

```java
package com.writersadmin.repository;

import com.writersadmin.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByOrderId(Long orderId);
    
    List<Message> findBySenderId(Long senderId);
    
    List<Message> findByReceiverId(Long receiverId);
    
    @Query("SELECT m FROM Message m WHERE m.order.id = :orderId ORDER BY m.createdAt ASC")
    List<Message> findByOrderIdOrderByCreatedAt(@Param("orderId") Long orderId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :receiverId AND m.isRead = false")
    Long countUnreadMessagesByReceiver(@Param("receiverId") Long receiverId);
    
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) AND m.order.id = :orderId")
    List<Message> findOrderMessagesByUser(@Param("orderId") Long orderId, @Param("userId") Long userId);
}
```

## TransactionRepository.java

```java
package com.writersadmin.repository;

import com.writersadmin.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUserId(Long userId);
    
    List<Transaction> findByOrderId(Long orderId);
    
    List<Transaction> findByTransactionType(Transaction.TransactionType type);
    
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.createdAt DESC")
    List<Transaction> findByUserIdOrderByDate(@Param("userId") Long userId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = :type AND t.status = 'completed'")
    BigDecimal sumCompletedTransactionsByUserAndType(@Param("userId") Long userId, @Param("type") Transaction.TransactionType type);
    
    @Query("SELECT t FROM Transaction t WHERE t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findTransactionsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.transactionType = 'order_payment' AND t.status = 'completed'")
    BigDecimal getTotalRevenue();
}
```

## Additional Repositories

```java
// OrderFileRepository.java
package com.writersadmin.repository;

import com.writersadmin.entity.OrderFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderFileRepository extends JpaRepository<OrderFile, Long> {
    List<OrderFile> findByOrderId(Long orderId);
    List<OrderFile> findByOrderIdAndFileCategory(Long orderId, OrderFile.FileCategory category);
}

// OrderRevenueRepository.java
package com.writersadmin.repository;

import com.writersadmin.entity.OrderRevenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrderRevenueRepository extends JpaRepository<OrderRevenue, Long> {
    Optional<OrderRevenue> findByOrderId(Long orderId);
}

// RevenueRuleRepository.java
package com.writersadmin.repository;

import com.writersadmin.entity.RevenueRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RevenueRuleRepository extends JpaRepository<RevenueRule, Long> {
    Optional<RevenueRule> findByCustomerTypeAndRole(RevenueRule.CustomerType customerType, RevenueRule.RoleType role);
}

// EditorRepository.java
package com.writersadmin.repository;

import com.writersadmin.entity.Editor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EditorRepository extends JpaRepository<Editor, Long> {
    Optional<Editor> findByUserId(Long userId);
}

// WriterManagerRepository.java
package com.writersadmin.repository;

import com.writersadmin.entity.WriterManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WriterManagerRepository extends JpaRepository<WriterManager, Long> {
    Optional<WriterManager> findByUserId(Long userId);
}

// ReviewRepository.java
package com.writersadmin.repository;

import com.writersadmin.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeId(Long revieweeId);
    List<Review> findByOrderId(Long orderId);
}

// NotificationRepository.java
package com.writersadmin.repository;

import com.writersadmin.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    Long countByUserIdAndIsRead(Long userId, Boolean isRead);
}
