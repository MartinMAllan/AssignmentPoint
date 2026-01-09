package com.assignmentpoint.repository;

import com.assignmentpoint.entity.SalesAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SalesAgentRepository extends JpaRepository<SalesAgent, Long> {
    Optional<SalesAgent> findByUserId(Long userId);
    Optional<SalesAgent> findByReferralCode(String referralCode);
    boolean existsByReferralCode(String referralCode);
}
