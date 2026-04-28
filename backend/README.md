# DOKZ STORE Backend

Backend server untuk DOKZ STORE - Premium Account Store.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Setup database:
```bash
mysql -u root -p
CREATE DATABASE dokz_store;
USE dokz_store;
SOURCE ../database/schema.sql;
SOURCE ../database/seed.sql;
```

3. Create `.env` file:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dokz_store

JWT_SECRET=your-secret-key-change-this-in-production

FRONTEND_URL=http://localhost:3000

MAIL_SERVICE=gmail
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

4. Run server:
```bash
npm run dev
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/google` - Google OAuth
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product detail
- GET `/api/products/search?q=keyword` - Search products
- GET `/api/products/category/:category` - Filter by category

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/my` - Get user orders
- GET `/api/orders/:id` - Get order detail
- POST `/api/orders/:id/confirm-payment` - Confirm payment

### Admin
- GET `/api/admin/dashboard` - Dashboard stats
- POST `/api/admin/products` - Add product
- PUT `/api/admin/products/:id` - Update product
- DELETE `/api/admin/products/:id` - Delete product
- POST `/api/admin/restock` - Bulk upload accounts
- GET `/api/admin/users` - Get all users
- POST `/api/admin/users/:userId/ban` - Ban user
- GET `/api/admin/logs` - Activity logs
