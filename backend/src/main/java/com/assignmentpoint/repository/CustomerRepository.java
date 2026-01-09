package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUserId(Long userId);
    List<Customer> findBySalesAgentId(Long salesAgentId);
    List<Customer> findByIsReturning(Boolean isReturning);
}
