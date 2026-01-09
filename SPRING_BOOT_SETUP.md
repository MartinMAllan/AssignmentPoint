# Writers Admin System - Spring Boot Backend

## Project Structure

```
writers-admin-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── writersadmin/
│   │   │           ├── WritersAdminApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── JwtConfig.java
│   │   │           │   └── CorsConfig.java
│   │   │           ├── entity/
│   │   │           │   ├── User.java
│   │   │           │   ├── Writer.java
│   │   │           │   ├── Customer.java
│   │   │           │   ├── SalesAgent.java
│   │   │           │   ├── Editor.java
│   │   │           │   ├── WriterManager.java
│   │   │           │   ├── Order.java
│   │   │           │   ├── OrderBid.java
│   │   │           │   ├── OrderFile.java
│   │   │           │   ├── Message.java
│   │   │           │   ├── Transaction.java
│   │   │           │   ├── OrderRevenue.java
│   │   │           │   ├── RevenueRule.java
│   │   │           │   ├── Review.java
│   │   │           │   └── Notification.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── WriterRepository.java
│   │   │           │   ├── CustomerRepository.java
│   │   │           │   ├── SalesAgentRepository.java
│   │   │           │   ├── EditorRepository.java
│   │   │           │   ├── WriterManagerRepository.java
│   │   │           │   ├── OrderRepository.java
│   │   │           │   ├── OrderBidRepository.java
│   │   │           │   ├── OrderFileRepository.java
│   │   │           │   ├── MessageRepository.java
│   │   │           │   ├── TransactionRepository.java
│   │   │           │   ├── OrderRevenueRepository.java
│   │   │           │   ├── RevenueRuleRepository.java
│   │   │           │   ├── ReviewRepository.java
│   │   │           │   └── NotificationRepository.java
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── UserService.java
│   │   │           │   ├── OrderService.java
│   │   │           │   ├── BidService.java
│   │   │           │   ├── MessageService.java
│   │   │           │   ├── TransactionService.java
│   │   │           │   ├── RevenueService.java
│   │   │           │   ├── FileUploadService.java
│   │   │           │   └── NotificationService.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── UserController.java
│   │   │           │   ├── OrderController.java
│   │   │           │   ├── BidController.java
│   │   │           │   ├── MessageController.java
│   │   │           │   ├── TransactionController.java
│   │   │           │   ├── DashboardController.java
│   │   │           │   └── AdminController.java
│   │   │           ├── dto/
│   │   │           │   ├── request/
│   │   │           │   │   ├── LoginRequest.java
│   │   │           │   │   ├── RegisterRequest.java
│   │   │           │   │   ├── CreateOrderRequest.java
│   │   │           │   │   ├── CreateBidRequest.java
│   │   │           │   │   └── SendMessageRequest.java
│   │   │           │   └── response/
│   │   │           │       ├── LoginResponse.java
│   │   │           │       ├── OrderResponse.java
│   │   │           │       ├── BidResponse.java
│   │   │           │       ├── DashboardStatsResponse.java
│   │   │           │       └── ApiResponse.java
│   │   │           ├── exception/
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── UnauthorizedException.java
│   │   │           │   └── BadRequestException.java
│   │   │           └── security/
│   │   │               ├── JwtTokenProvider.java
│   │   │               ├── JwtAuthenticationFilter.java
│   │   │               └── CustomUserDetailsService.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-dev.properties
│   └── test/
│       └── java/
│           └── com/
│               └── writersadmin/
│                   └── WritersAdminApplicationTests.java
├── pom.xml
└── README.md
```

## Maven Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.writersadmin</groupId>
    <artifactId>writers-admin-backend</artifactId>
    <version>1.0.0</version>
    <name>Writers Admin System</name>
    <description>Backend API for Writers Admin System</description>
    
    <properties>
        <java.version>17</java.version>
        <jwt.version>0.11.5</jwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- ModelMapper -->
        <dependency>
            <groupId>org.modelmapper</groupId>
            <artifactId>modelmapper</artifactId>
            <version>3.1.1</version>
        </dependency>
        
        <!-- Apache Commons -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
        </dependency>
        
        <!-- Test Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## Application Properties

See the configuration files in the next sections.
```

```properties file="application.properties"
# Application Configuration
spring.application.name=Writers Admin System
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/writers_admin_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-secret-key-change-this-in-production-minimum-256-bits
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# File Upload Configuration
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=./uploads

# Logging
logging.level.com.writersadmin=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
