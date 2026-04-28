# DOKZ STORE - API Documentation

## Overview

RESTful API untuk DOKZ STORE - Premium Account Store

**Base URL:**
- Development: `http://localhost:5000/api`
- Production: `https://yourdomain.com/api`

**Authentication:** JWT Bearer Token

## Authentication

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "is_banned": false,
    "created_at": "2024-04-27T10:00:00Z"
  }
}
```

---

## Products

### Get All Products

```http
GET /products
```

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "ChatGPT",
      "slug": "chatgpt",
      "price": 19.99,
      "description": "ChatGPT Plus subscription",
      "category": "AI",
      "status": "available",
      "available_stock": 10,
      "total_accounts": 15
    }
  ]
}
```

### Get Product Detail

```http
GET /products/{id}
```

**Response (200):**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "ChatGPT",
    "slug": "chatgpt",
    "price": 19.99,
    "description": "ChatGPT Plus subscription account",
    "image_url": "...",
    "category": "AI",
    "is_active": true,
    "total_accounts": 15,
    "available_stock": 10,
    "status": "available",
    "created_at": "2024-04-27T10:00:00Z"
  }
}
```

### Search Products

```http
GET /products/search?q=chatgpt
```

### Filter by Category

```http
GET /products/category/AI
```

---

## Orders

### Create Order

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 2
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "orderNumber": "ORD-1234567890-123",
    "totalPrice": 49.97,
    "status": "pending"
  }
}
```

### Get My Orders

```http
GET /orders/my
Authorization: Bearer <token>

# Optional query
GET /orders/my?status=pending
```

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-1234567890-123",
      "total_price": 49.97,
      "status": "pending",
      "payment_method": "manual",
      "created_at": "2024-04-27T10:00:00Z",
      "items": [...]
    }
  ]
}
```

### Get Order Detail

```http
GET /orders/{orderId}
Authorization: Bearer <token>
```

### Confirm Payment

```http
POST /orders/{orderId}/confirm-payment
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment confirmed and account delivered"
}
```

Sistem akan otomatis:
- Mark pembayaran sebagai confirmed
- Ambil akun yang tersedia
- Assign ke order
- Kirim email dengan credentials
- Update status → DELIVERED

---

## Admin

### Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "dashboard": {
    "totalOrders": 42,
    "totalRevenue": 1200.50,
    "totalUsers": 156,
    "totalProducts": 15
  }
}
```

### Add Product

```http
POST /api/admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Premium Service",
  "slug": "new-premium",
  "description": "Amazing premium service",
  "price": 9.99,
  "imageUrl": "...",
  "category": "Entertainment"
}
```

### Bulk Restock Accounts

```http
POST /api/admin/restock
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "productId": 1,
  "accounts": [
    "email1@example.com|password123|https://temp-mail.org/...",
    "email2@example.com|password456|https://temp-mail.org/..."
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "2 accounts added to ChatGPT"
}
```

### Get All Users

```http
GET /api/admin/users?limit=50&offset=0
Authorization: Bearer <admin_token>
```

### Ban User

```http
POST /api/admin/users/{userId}/ban
Authorization: Bearer <admin_token>
```

### Get Activity Logs

```http
GET /api/admin/logs?limit=100&offset=0
Authorization: Bearer <admin_token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Tidak ada rate limiting di development. Untuk production:
- Login: 5 attempts per 15 minutes
- API: 100 requests per minute (per user)

---

## Pagination

Gunakan `limit` dan `offset` untuk pagination:
```http
GET /api/admin/users?limit=20&offset=0
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Examples

### JavaScript/Fetch

```javascript
const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

// Create order
const response = await fetch(`${API_URL}/orders`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [{ productId: 1, quantity: 1 }]
  })
});

const data = await response.json();
console.log(data);
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get products
curl http://localhost:5000/api/products

# Create order (with token)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"productId":1,"quantity":1}]}'
```

---

**API Documentation v1.0** ⚡
