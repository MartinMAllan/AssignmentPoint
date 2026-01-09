package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByOrderId(Long orderId);
    List<Message> findByOrderIdOrderByCreatedAtDesc(Long orderId);
    List<Message> findByOrderIdAndIsReadFalse(Long orderId);
}
