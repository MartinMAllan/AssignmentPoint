package com.assignmentpoint.repository;

import com.assignmentpoint.entity.OrderFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderFileRepository extends JpaRepository<OrderFile, Long> {
    List<OrderFile> findByOrderId(Long orderId);
    List<OrderFile> findByOrderIdAndFileCategory(Long orderId, String fileCategory);
    List<OrderFile> findByUploadedById(Long userId);
}
