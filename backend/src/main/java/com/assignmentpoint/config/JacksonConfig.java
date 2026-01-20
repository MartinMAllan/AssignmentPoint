package com.assignmentpoint.config;

import com.assignmentpoint.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        mapper.registerModule(new JavaTimeModule());

        SimpleModule module = new SimpleModule();
        module.addSerializer(User.UserRole.class, new UserRoleSerializer());
        mapper.registerModule(module);

        return mapper;
    }
}
