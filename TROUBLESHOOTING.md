# DOKZ STORE - Troubleshooting Guide

## Common Issues & Solutions

### 1. Database Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solutions:**
```bash
# Check MySQL is running
sudo service mysql status

# Start MySQL if not running
sudo service mysql start

# Verify credentials
mysql -u root -p

# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p < database/schema.sql
```

---

### 2. Port Already in Use

**Error:** `Error: listen EADDRINUSE :::5000`

**Solutions:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

---

### 3. JWT Token Errors

**Error:** "Invalid token" or "No token provided"

**Solutions:**
- Make sure JWT_SECRET is set in .env
- Token format: `Authorization: Bearer <token>`
- Token expires in 7 days, user needs to login again

---

### 4. CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Check FRONTEND_URL in backend .env
- Make sure frontend requests include credentials
- Verify CORS middleware in Express

```javascript
// In backend/src/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

### 5. Email Not Sending

**Error:** `Error: Invalid login: 535 Authentication failed`

**Solutions:**
```bash
# Using Gmail:
1. Enable 2-factor authentication in Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in MAIL_PASS, not your Gmail password

# Using other providers:
- Check MAIL_SERVICE spelling
- Verify credentials with provider
- Check firewall allows SMTP port 587
```

---

### 6. No Products Showing

**Error:** Products page shows empty

**Solutions:**
```bash
# Check products in database
mysql -u dokz_user -pdokz_password dokz_store -e "SELECT * FROM products;"

# If empty, seed database
mysql -u dokz_user -pdokz_password dokz_store < database/seed.sql

# Or manually add:
INSERT INTO products (name, slug, price, description, category) 
VALUES ('Test Product', 'test-product', 9.99, 'Test Description', 'Test');
```

---

### 7. Admin Panel Not Accessible

**Error:** Redirects to home page

**Solutions:**
```bash
# Check user role
mysql -u dokz_user -pdokz_password dokz_store -e "SELECT id, email, role FROM users;"

# Update user to admin
UPDATE users SET role='admin' WHERE id=1;

# Frontend checks user role, make sure JWT includes role
```

---

### 8. NPM Dependency Issues

**Error:** `npm ERR! code ERESOLVE`

**Solutions:**
```bash
# Clear cache
npm cache clean --force

# Try different node version
nvm list
nvm install 20
nvm use 20

# Or force resolution
npm install --legacy-peer-deps
```

---

### 9. Build Fails

**Error:** `Build failed` during `npm run build`

**Solutions:**
```bash
# Clear build cache
rm -rf .next
rm -rf dist
rm -rf build

# Rebuild
npm run build

# Check for TypeScript errors (frontend)
npm run lint

# Check for syntax errors
node -c src/index.js (backend)
```

---

### 10. Payment Status Not Updating

**Error:** Order stays "pending" or doesn't auto-deliver

**Solutions:**
```bash
# Check order in database
SELECT * FROM orders WHERE status='pending';

# Check account availability
SELECT COUNT(*) FROM accounts WHERE product_id=1 AND is_sold=FALSE;

# Manually confirm payment endpoint
curl -X POST http://localhost:5000/api/orders/1/confirm-payment \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 11. Frontend Not Connecting to Backend

**Error:** `Failed to fetch` errors in browser

**Solutions:**
```bash
# Check .env.local has correct API URL
cat frontend/.env.local
# Should have: NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Verify backend is running
curl http://localhost:5000/api/health

# Check browser console for CORS errors
# Check network tab in DevTools

# Make sure frontend requests have correct headers
```

---

### 12. SSL Certificate Issues

**Error:** `ERR_SSL_PROTOCOL_ERROR` or mixed content warnings

**Solutions:**
```bash
# Verify SSL certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check Nginx SSL config
sudo nginx -t

# Force HTTPS redirect in nginx.conf
if ($scheme != "https") {
    return 301 https://$server_name$request_uri;
}

# Restart Nginx
sudo systemctl restart nginx
```

---

### 13. Out of Memory Error

**Error:** `JavaScript heap out of memory`

**Solutions:**
```bash
# Increase Node memory (for backend)
NODE_OPTIONS="--max-old-space-size=2048" npm start

# Or in PM2
pm2 start src/index.js --max-memory-restart 500M

# For frontend build
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

---

### 14. Slow Performance

**Error:** Website loading slow, database slow

**Solutions:**
```bash
# Add database indexes
ALTER TABLE orders ADD INDEX idx_user_status (user_id, status);
ALTER TABLE accounts ADD INDEX idx_product_sold (product_id, is_sold);

# Check slow query log
mysql -u root -p -e "SELECT * FROM mysql.slow_log;"

# Enable gzip in nginx.conf
gzip on;

# Add caching headers for static files
```

---

### 15. Can't Upload Accounts

**Error:** Bulk restock returns error

**Solutions:**
```bash
# Verify format: email|password|link
echo "test@example.com|password123|https://temp-mail.org"

# Check product exists
SELECT * FROM products WHERE id=1;

# Test endpoint
curl -X POST http://localhost:5000/api/admin/restock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"productId":1,"accounts":["test@example.com|pass123|http://link"]}'
```

---

## Debug Mode

### Enable Debug Logging

**Backend:**
```bash
# In .env
NODE_ENV=development
DEBUG=*

# Or in code
console.log('Debug:', variable);

# Or use nodemon with inspect
nodemon --inspect src/index.js
```

**Frontend:**
```bash
# Browser DevTools: F12
# Network tab - see requests
# Console tab - see errors
# React DevTools extension
```

---

## Useful Commands

```bash
# Database backups
mysqldump -u root -p dokz_store > backup.sql

# Check running services
pm2 list

# View logs
pm2 logs dokz-api
pm2 logs dokz-web

# Monitor resources
pm2 monit

# Restart services
pm2 restart all

# Check ports
netstat -tulpn | grep LISTEN
```

---

## Getting Help

1. **Check logs first**
   ```bash
   pm2 logs dokz-api
   pm2 logs dokz-web
   journalctl -u nginx -n 50
   ```

2. **Read error messages carefully** - they usually explain the issue

3. **Search error online** - copy exact error message

4. **Check environment variables** - most issues are config-related

5. **Verify prerequisites** - Node, MySQL, Nginx versions

---

**Still stuck?** Check:
- README.md
- DEPLOYMENT.md
- API_DOCS.md
- Backend README.md
- Frontend README.md

---

**Troubleshooting Guide v1.0** ⚡
