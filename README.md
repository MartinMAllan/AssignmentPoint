# Assignment Point

A comprehensive academic writing service management platform with separate interfaces for writers, customers, sales agents, editors, and administrators.

## Features

- **Multi-Role Support**: Writers, Customers, Sales Agents, Editors, Admins, Writer Managers
- **Order Management**: Create, bid, assign, track orders
- **Revenue Sharing**: Automated commission distribution
- **Real-time Messaging**: Communication between all parties
- **File Management**: Upload and download order materials
- **Transaction Tracking**: Complete financial transparency

## Tech Stack

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI

**Backend:**
- Spring Boot 3.2
- Java 17
- MySQL 8
- JWT Authentication
- Spring Security

## Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Database Setup
```bash
mysql -u root -p
CREATE DATABASE assignment_point;
exit

# Import schema
mysql -u root -p assignment_point < database/schema.sql
```

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on \`http://localhost:8080\`

### Frontend Setup
```bash
npm install
npm run dev
```

Frontend runs on \`http://localhost:3000\`

## Default Login Credentials

After running the database schema, you can login with:

- **Admin**: admin@assignmentpoint.com / admin123
- **Writer**: writer@assignmentpoint.com / writer123
- **Customer**: customer@assignmentpoint.com / customer123

## API Documentation

The backend API runs on \`http://localhost:8080/api\`

### Health Check
```
GET /api/health
```

### Authentication
```
POST /auth/register
POST /auth/login
```

### Orders
```
GET /orders
POST /orders
GET /orders/{id}
GET /orders/available
```

### Bids
```
POST /bids
GET /bids/order/{orderId}
POST /bids/{id}/accept
```

## Project Structure

```
assignment-point/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                    # Utilities and services
├── backend/                # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   └── pom.xml
└── database/              # SQL schema
```

## License

Proprietary - All rights reserved

## Support

For support, email support@assignmentpoint.com
