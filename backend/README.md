# Assignment Point - Backend

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Quick Start

### 1. Create Database
```bash
mysql -u root -p
CREATE DATABASE assignment_point;
```

### 2. Configure Database
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/assignment_point
spring.datasource.username=your_username
spring.datasource.password=your_password
```
