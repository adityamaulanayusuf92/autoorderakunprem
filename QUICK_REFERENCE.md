# ⚡ DOKZ STORE - Quick Reference

## 🚀 Quick Start (5 Minutes)

### Docker (Easiest)
```bash
cd autoorderakunprem
docker-compose up -d
# Akses: http://localhost:3000
```

### Manual Setup
```bash
# Terminal 1 - Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

---

## 📍 Akses Aplikasi

| Service | URL | Admin Credentials |
|---------|-----|-------------------|
| Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:5000/api | - |
| Health Check | http://localhost:5000/api/health | - |

---

## 👤 Test Account

```
Email: test@example.com
Password: password123

Note: Create via frontend register for real testing
```

---

## 🗂️ File Locations

| File | Purpose |
|------|---------|
| `.env` | Backend configuration |
| `.env.local` | Frontend configuration |
| `database/schema.sql` | Database structure |
| `database/seed.sql` | Sample data |
| `nginx.conf` | Reverse proxy config |
| `docker-compose.yml` | Container setup |

---

## 🔑 API Quick Reference

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":1,"quantity":1}]}'
```

### Confirm Payment (Auto Delivery)
```bash
curl -X POST http://localhost:5000/api/orders/1/confirm-payment \
  -H "Authorization: Bearer <token>"
```

---

## 💾 Database Commands

```bash
# Connect
mysql -u dokz_user -p dokz_store

# View products
SELECT * FROM products;

# View orders
SELECT * FROM orders;

# Check available accounts
SELECT COUNT(*) FROM accounts 
WHERE product_id=1 AND is_sold=FALSE;

# Make user admin
UPDATE users SET role='admin' WHERE id=1;

# Get all users
SELECT id, email, role FROM users;
```

---

## 🐛 Common Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `lsof -i :5000` then `kill -9 <PID>` |
| DB connection failed | Check `docker ps`, verify MySQL running |
| CORS error | Check `FRONTEND_URL` in .env |
| API returns 401 | Token expired or invalid, re-login |
| Build failed | `npm cache clean --force` then `npm install` |

---

## 📝 Adding a New Product

### Via Database
```sql
INSERT INTO products (name, slug, price, description, category)
VALUES ('New Product', 'new-product', 9.99, 'Description', 'Category');
```

### Via Admin API
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "slug": "new-product",
    "price": 9.99,
    "description": "Description",
    "category": "Category"
  }'
```

---

## 📦 Bulk Upload Accounts

### Format (email|password|link)
```
user1@example.com|pass123|https://temp-mail.org/...
user2@example.com|pass456|https://temp-mail.org/...
```

### Upload
```bash
curl -X POST http://localhost:5000/api/admin/restock \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "accounts": [
      "email1@example.com|password1|https://link1",
      "email2@example.com|password2|https://link2"
    ]
  }'
```

---

## 🔄 Workflow: Order → Delivery

1. **User Browse** → `/products`
2. **Add Cart** → `/cart`
3. **Checkout** → POST `/orders`
4. **Confirm Payment** → POST `/orders/{id}/confirm-payment`
5. **Auto Delivery** → System:
   - Ambil akun tersedia
   - Mark as sold
   - Assign ke order
   - Kirim email
   - Status → DELIVERED
6. **View Akun** → `/dashboard`
   - Copy email
   - Copy password
   - Buka temp mail

---

## 🎨 Frontend Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page |
| Products | `/products` | Product listing |
| Cart | `/cart` | Shopping cart |
| Dashboard | `/dashboard` | User profile & orders |
| Order Detail | `/orders/:id` | Order tracking |
| Login | `/login` | Login page |
| Register | `/register` | Register page |
| Admin | `/admin` | Admin panel |

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=dokz_user
DB_PASSWORD=dokz_password
DB_NAME=dokz_store
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
MAIL_SERVICE=gmail
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📞 Process Management (PM2)

```bash
# Install PM2
npm install -g pm2

# Start services
pm2 start backend/src/index.js --name "dokz-api"
pm2 start "npm run dev" --cwd frontend --name "dokz-web"

# View status
pm2 status

# View logs
pm2 logs dokz-api
pm2 logs dokz-web

# Restart
pm2 restart all

# Monitor
pm2 monit
```

---

## 🔐 Admin Routes (Protected)

Only accessible with role='admin':
- POST /admin/products - Add product
- PUT /admin/products/:id - Edit product
- DELETE /admin/products/:id - Delete product
- POST /admin/restock - Upload accounts
- GET /admin/users - List users
- POST /admin/users/:id/ban - Ban user
- GET /admin/logs - Activity logs

---

## 📊 Stock System

Auto-calculated:
```javascript
Available Stock = Total Accounts - Sold Accounts

Status = Available Stock > 0 ? "available" : "out_of_stock"
```

---

## 🚀 Deployment Quick Commands

### VPS Setup
```bash
# Install Node
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Deploy
cd /var/www/autoorderakunprem
npm install --production
pm2 start src/index.js
```

### Using Docker
```bash
cd autoorderakunprem
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📈 Monitoring

```bash
# Check services
pm2 status

# Database size
mysql -u root -p -e "SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'dokz_store';"

# API health
curl http://localhost:5000/api/health
```

---

## 🔍 Debug Tips

### Get Full Error Details
```bash
# Backend logs
pm2 logs dokz-api --lines 100

# Browser console
F12 → Console tab

# Network requests
F12 → Network tab
```

### Test Endpoints
```bash
# Simple
curl http://localhost:5000/api/health

# With auth
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/auth/me
```

---

## 💡 Tips & Tricks

1. **Fast Reload Frontend** - Changes save automatically with `npm run dev`

2. **Test Payment Flow**
   ```bash
   # Confirm payment via API
   curl -X POST http://localhost:5000/api/orders/1/confirm-payment
   ```

3. **Database Backup**
   ```bash
   mysqldump -u dokz_user -p dokz_store > backup.sql
   ```

4. **Check Open Ports**
   ```bash
   netstat -tulpn | grep LISTEN
   ```

5. **View Nginx Status**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t  # Test config
   ```

---

## 📚 Documentation Files

- `README.md` - Main documentation
- `API_DOCS.md` - Complete API reference
- `DEPLOYMENT.md` - Deployment guide
- `TROUBLESHOOTING.md` - Common issues
- `COMPLETION.md` - Feature checklist
- `backend/README.md` - Backend details
- `frontend/README.md` - Frontend details

---

## ✅ Production Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Set MAIL credentials
- [ ] Configure database backup
- [ ] Setup SSL certificate
- [ ] Install firewall (UFW/iptables)
- [ ] Enable fail2ban
- [ ] Setup monitoring
- [ ] Configure log rotation
- [ ] Setup auto-restart with PM2
- [ ] Configure Nginx caching

---

## 🎯 Key Features to Remember

1. **Auto Delivery** - Happens instantly when payment confirmed
2. **Auto Stock** - Calculated from available accounts
3. **Email Sending** - Setup MAIL vars for notifications
4. **Admin Panel** - Accessible at `/admin` (role must be 'admin')
5. **JWT Auth** - Token expires in 7 days

---

## 🆘 Emergency Commands

```bash
# Restart all services
pm2 restart all

# Clear cache & rebuild
rm -rf .next build dist
npm run build

# Reset database
mysql -u root -p dokz_store < database/schema.sql

# Kill hanging process
pkill -f "node"

# View real-time logs
pm2 logs --lines 100 --follow
```

---

**Quick Reference Version 1.0** ⚡

Save this file for quick access to common commands!
