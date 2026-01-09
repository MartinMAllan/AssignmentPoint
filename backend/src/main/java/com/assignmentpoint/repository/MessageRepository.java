package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByOrderId(Long orderId, Pageable pageable);
    Page<Message> findBySenderIdOrReceiverId(Long senderId, Long receiverId, Pageable pageable);

    List<Message> findByOrderId(Long orderId);
    List<Message> findByOrderIdOrderByCreatedAtDesc(Long orderId);
    List<Message> findByOrderIdAndIsReadFalse(Long orderId);

    Page<Message> findByOrderIdOrderByCreatedAtDesc(Long orderId, Pageable pageable);
}
