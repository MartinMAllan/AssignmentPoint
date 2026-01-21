# API Endpoints Reference

## Authentication Endpoints

### POST /api/auth/register
Register a new user
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "writer",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "referralCode": "REF-ABC123" // Optional, for customers
}
```

### POST /api/auth/login
Login user
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Order Endpoints

### GET /api/orders/available
Get all available orders for bidding

### POST /api/orders
Create new order (Customer only)

### GET /api/orders/{id}
Get order details

### PATCH /api/orders/{id}/status
Update order status

### GET /api/orders/my-orders
Get user's orders (filtered by role)

## Bid Endpoints

### POST /api/bids
Submit a bid on an order

### GET /api/bids/order/{orderId}
Get all bids for an order

### POST /api/bids/{bidId}/accept
Accept a bid (Customer only)

## Message Endpoints

### GET /api/messages/order/{orderId}
Get messages for an order

### POST /api/messages
Send a message

## Transaction Endpoints

### GET /api/transactions/my-transactions
Get user's transaction history

### GET /api/transactions/stats
Get earnings/payment statistics

## Dashboard Endpoints

### GET /api/dashboard/stats
Get role-specific dashboard statistics

## Admin Endpoints (Admin only)

### GET /api/admin/users
Get all users

### GET /api/admin/orders
Get all orders with filters

### GET /api/admin/analytics
Get platform analytics

### PATCH /api/admin/users/{id}/status
Activate/Deactivate user

## How to Use

1. All endpoints except `/api/auth/*` require authentication
2. Include JWT token in Authorization header: `Bearer <token>`
3. Tokens are returned upon login/registration
4. Role-based access control is enforced

## Example cURL Request

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"writer@test.com","password":"password123"}'

# Get available orders (with token)
curl -X GET http://localhost:8080/api/orders/available \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Submit bid
curl -X POST http://localhost:8080/api/bids \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"coverLetter":"I am experienced..."}'
