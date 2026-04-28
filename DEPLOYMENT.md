# DOKZ STORE - Deployment Guide

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for Development)

1. **Install Docker & Docker Compose**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

2. **Run Project**
```bash
chmod +x setup.sh
./setup.sh
```

3. **Access Services**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- Database: MySQL at localhost:3306

---

### Option 2: Manual Setup (VPS/Dedicated Server)

#### Prerequisites
- Ubuntu 20.04 LTS or later
- 2GB RAM minimum
- 20GB disk space

#### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

#### Step 2: Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/yourusername/autoorderakunprem.git
cd autoorderakunprem
sudo chown -R $USER:$USER .
```

#### Step 3: Setup Database

```bash
sudo mysql -u root -p << EOF
CREATE DATABASE dokz_store;
CREATE USER 'dokz_user'@'localhost' IDENTIFIED BY 'dokz_password';
GRANT ALL PRIVILEGES ON dokz_store.* TO 'dokz_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Import schema
mysql -u dokz_user -pdokz_password dokz_store < database/schema.sql
mysql -u dokz_user -pdokz_password dokz_store < database/seed.sql
```

#### Step 4: Setup Backend

```bash
cd backend
cp .env.example .env

# Edit .env
nano .env
```

Edit nilai berikut di `.env`:
```
DB_USER=dokz_user
DB_PASSWORD=dokz_password
DB_NAME=dokz_store
JWT_SECRET=your-very-random-secret-key
FRONTEND_URL=https://yourdomain.com
```

```bash
npm install --production
pm2 start src/index.js --name "dokz-backend"
pm2 save
pm2 startup
```

#### Step 5: Setup Frontend

```bash
cd ../frontend
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Edit nilai:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

```bash
npm install --production
npm run build
pm2 start npm --name "dokz-frontend" -- start
```

#### Step 6: Setup Nginx

```bash
# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/dokz-store

# Edit dan ganti yourdomain.com
sudo nano /etc/nginx/sites-available/dokz-store

# Enable site
sudo ln -s /etc/nginx/sites-available/dokz-store /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart
sudo systemctl restart nginx
```

#### Step 7: Setup SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Step 8: Verify Services

```bash
# Check PM2
pm2 status

# Check Nginx
systemctl status nginx

# Check MySQL
systemctl status mysql

# Test API
curl https://yourdomain.com/api/health
```

---

### Option 3: cPanel/Shared Hosting

#### Prerequisites
- cPanel with Node.js support
- Dedicated MySQL database
- SSL certificate

#### Steps

1. **Upload files**
   - Upload `backend` folder to `public_html/api`
   - Upload `frontend` build to `public_html/public_html`

2. **Create Node.js App** (in cPanel)
   - Domain: yourdomain.com/api
   - App path: /home/username/public_html/api
   - App startup file: src/index.js

3. **Create Database**
   - Via phpMyAdmin in cPanel
   - Import schema.sql and seed.sql

4. **Set Environment**
   - Create .env in backend folder via File Manager
   - Set DB credentials from cPanel

5. **Enable SSL**
   - Use AutoSSL or Let's Encrypt in cPanel

---

## 📊 Production Checklist

- [ ] Environment variables set correctly
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] Nginx configured with compression
- [ ] PM2 set to auto-restart
- [ ] Firewall configured (port 80, 443 open)
- [ ] Failed2ban installed for security
- [ ] Monitoring/alerts setup
- [ ] Log rotation configured
- [ ] Backup strategy in place

---

## 🔒 Security Hardening

### Firewall Setup (UFW)

```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5000/tcp
sudo ufw deny 3000/tcp
```

### Fail2Ban

```bash
sudo apt install -y fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### Automatic Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-dokz.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/dokz"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u dokz_user -pdokz_password dokz_store > $BACKUP_DIR/dokz_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "dokz_*.sql" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-dokz.sh

# Add to crontab
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-dokz.sh
```

---

## 📈 Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs

# Email notifications
pm2 install pm2-auto-pull
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
pm2 logs dokz-backend
# Check .env values
# Check MySQL connection
```

### Database connection failed
```bash
mysql -u dokz_user -pdokz_password
USE dokz_store;
SHOW TABLES;
```

### Port already in use
```bash
lsof -i :5000
lsof -i :3000
# Kill process or change port
```

### SSL not working
```bash
sudo certbot renew --dry-run
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔄 Updating

```bash
cd /var/www/autoorderakunprem

# Pull latest
git pull origin main

# Backend update
cd backend
npm install --production
pm2 restart dokz-backend

# Frontend update
cd ../frontend
npm install --production
npm run build
pm2 restart dokz-frontend
```

---

## 📞 Support

Untuk bantuan technical support atau custom deployment, hubungi tim development.

---

**DOKZ STORE Deployment Guide v1.0** ⚡
