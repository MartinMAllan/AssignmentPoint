package com.assignmentpoint.repository;

import com.assignmentpoint.entity.RevenueRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RevenueRuleRepository extends JpaRepository<RevenueRule, Long> {
    Optional<RevenueRule> findByIsReturningCustomerAndIsActive(Boolean isReturningCustomer, Boolean isActive);
    Optional<RevenueRule> findByRuleName(String ruleName);
}
