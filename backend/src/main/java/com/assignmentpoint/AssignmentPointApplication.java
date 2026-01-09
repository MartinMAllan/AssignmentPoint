package com.assignmentpoint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AssignmentPointApplication {
    public static void main(String[] args) {
        SpringApplication.run(AssignmentPointApplication.class, args);
    }
}
