# DOKZ STORE - Full Stack Premium Account Store

Website full-stack modern untuk menjual akun premium berbagai layanan dengan desain neon futuristik.

## 📂 Struktur Proyek

```
autoorderakunprem/
├── backend/                 - Express.js server
│   ├── src/
│   │   ├── config/         - Database & mail config
│   │   ├── controllers/    - Business logic
│   │   ├── middleware/     - Authentication middleware
│   │   ├── models/         - Database queries
│   │   ├── routes/         - API routes
│   │   ├── utils/          - Helper functions
│   │   └── index.js        - Server entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                - Next.js 14 app
│   ├── app/
│   │   ├── (auth)/         - Login & Register
│   │   ├── (main)/         - Main pages
│   │   ├── admin/          - Admin panel
│   │   ├── layout.jsx      - Root layout
│   │   └── page.jsx        - Home page
│   ├── components/         - UI components
│   ├── lib/
│   │   ├── api.js          - API client
│   │   ├── store.js        - Zustand store
│   │   └── utils.js        - Utilities
│   ├── public/             - Static assets
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── database/               - SQL files
│   ├── schema.sql          - Database schema
│   └── seed.sql            - Sample data
│
└── README.md               - This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MySQL 8+
- npm atau yarn

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan database credentials Anda
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 2. Setup Database

```bash
mysql -u root -p
CREATE DATABASE dokz_store;
USE dokz_store;
SOURCE ../database/schema.sql;
SOURCE ../database/seed.sql;
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 4. Access aplikasi
- Website: http://localhost:3000
- Admin: Login dengan role admin
- API: http://localhost:5000/api

## 🎨 Tech Stack

**Backend:**
- Express.js (Node.js)
- MySQL
- JWT Authentication
- Nodemailer

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- Zustand (state management)
- Axios

## ✨ Fitur Utama

### User
- ✅ Register / Login / Google OAuth
- ✅ Dashboard dengan order history
- ✅ Browse & search produk
- ✅ Filter kategori otomatis
- ✅ Shopping cart
- ✅ Checkout
- ✅ Auto delivery akun (instan)
- ✅ Copy email/password button
- ✅ Temp mail link
- ✅ Order tracking

### Admin
- ✅ Dashboard (stats: orders, revenue, users, products)
- ✅ Manage products (add/edit/delete)
- ✅ Bulk upload akun (format: email|password|link)
- ✅ Manage orders (approve/reject)
- ✅ Manage users (ban/unban)
- ✅ Activity logs

### Sistem Stok Auto
- ✅ Stok = jumlah akun yang belum terjual
- ✅ Status otomatis: Available / Out of Stock
- ✅ Auto-assigned saat order dibayar
- ✅ Auto-mark akun sebagai terjual

## 🔑 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
GET    /api/auth/me
```

### Products
```
GET    /api/products
GET    /api/products/:id
GET    /api/products/search?q=keyword
GET    /api/products/category/:category
POST   /api/products           (admin)
PUT    /api/products/:id       (admin)
DELETE /api/products/:id       (admin)
```

### Orders
```
POST   /api/orders
GET    /api/orders/my
GET    /api/orders/:id
POST   /api/orders/:id/confirm-payment
GET    /api/admin/orders        (admin)
POST   /api/admin/orders/:id/approve (admin)
```

### Admin
```
GET    /api/admin/dashboard
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
POST   /api/admin/restock
GET    /api/admin/users
POST   /api/admin/users/:id/ban
GET    /api/admin/logs
```

## 🎁 Stok Produk Default

15 produk premium sudah ada:
- Alight Motion
- Bstation
- Canva
- Capcut
- ChatGPT
- iQiyi
- Loko Lok
- Meitu
- Prime Video
- Simerah Platinum
- Spotify
- Viu
- WeTV
- Wink
- Youku

## 🚀 Deployment

### VPS/Dedicated Server

**1. Install Dependencies**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs mysql-server nginx
sudo npm install -g pm2
```

**2. Deploy Backend**
```bash
cd backend
npm install --production
cp .env.example .env
# Edit .env dengan database credentials
pm2 start src/index.js --name "dokz-backend"
pm2 save
pm2 startup
```

**3. Deploy Frontend**
```bash
cd frontend
npm install --production
npm run build
pm2 start npm --name "dokz-frontend" -- start
```

**4. Setup Nginx (Reverse Proxy)**
```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

**5. Setup SSL (Let's Encrypt)**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### cPanel/Shared Hosting

1. Upload ke public_html dengan struktur folder
2. Setup Node.js app melalui cPanel
3. Database via phpMyAdmin
4. Configure SSL di cPanel

## 🔐 Security

- ✅ Password hashing (bcryptjs)
- ✅ JWT tokens (7 hari)
- ✅ CORS protection
- ✅ Input validation
- ✅ Role-based access control
- ✅ Prepared statements (SQL injection protection)

## 📝 Environment Setup

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dokz_store
JWT_SECRET=your-secret-key-change-this
FRONTEND_URL=https://yourdomain.com
MAIL_SERVICE=gmail
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

## 📊 Database Schema

**users** - User accounts & authentication
**products** - Product catalog
**accounts** - Stock (email & password list)
**orders** - Order transactions
**order_items** - Order line items + delivered credentials
**activity_logs** - Audit trail

## 🎯 Fitur Inti

### Auto Delivery System
Saat order dibayar:
1. Sistem ambil 1 akun yang tersedia
2. Mark akun sebagai terjual
3. Assign ke order item
4. Kirim email ke user
5. Status order → DELIVERED

### Bulk Restock
Admin bisa upload akun dengan format:
```
email1@example.com|password123|https://temp-mail.org/...
email2@example.com|password456|https://temp-mail.org/...
...
```

## 🐛 Troubleshooting

**Database Connection Error**
- Check MySQL running: `sudo service mysql status`
- Verify credentials di .env
- Create database: `mysql -u root -p < database/schema.sql`

**Port Already in Use**
- Backend: `lsof -i :5000` & kill process
- Frontend: `lsof -i :3000` & kill process

**CORS Error**
- Update FRONTEND_URL di backend .env
- Check API_URL di frontend .env.local

## 📚 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Database Schema](./database/schema.sql)

## 📞 Support

Siap membantu deployment, customization, atau troubleshooting!

---

**DOKZ STORE v1.0** - Production Ready ⚡
**Last Update:** 2024
**License:** Private