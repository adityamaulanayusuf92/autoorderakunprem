#!/bin/bash

# DOKZ STORE - Production Deployment Script
# Usage: ./deploy-prod.sh

set -e

echo "🚀 DOKZ STORE Production Deployment"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL client is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# Pull latest code
echo "📥 Pulling latest code from repository..."
git pull origin main

echo ""
echo "🔧 Building backend..."
cd backend
cp .env.example .env
echo -e "${YELLOW}⚠️  Please edit backend/.env with your production settings${NC}"
npm install --production
npm run build || true
cd ..

echo ""
echo "🎨 Building frontend..."
cd frontend
cp .env.example .env.local
echo -e "${YELLOW}⚠️  Please edit frontend/.env.local with your production settings${NC}"
npm install --production
npm run build
cd ..

echo ""
echo "🗄️  Setting up database..."
echo -e "${YELLOW}⚠️  Make sure MySQL is running and credentials are set in backend/.env${NC}"

echo ""
echo -e "${GREEN}✅ Deployment package prepared!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Review and edit backend/.env with production values"
echo "2. Review and edit frontend/.env.local"
echo "3. Start services using PM2 or your preferred process manager:"
echo ""
echo "   PM2 example:"
echo "   cd backend && pm2 start src/index.js --name 'dokz-api'"
echo "   cd ../frontend && pm2 start npm --name 'dokz-web' -- start"
echo ""
echo "4. Setup Nginx reverse proxy using nginx.conf"
echo "5. Setup SSL certificate with Let's Encrypt"
echo "6. Configure firewall and security settings"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo ""

if command -v pm2 &> /dev/null; then
    read -p "Start services with PM2? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd backend
        pm2 start src/index.js --name "dokz-api"
        cd ../frontend
        pm2 start npm --name "dokz-web" -- start
        pm2 save
        pm2 startup
        
        echo -e "${GREEN}✅ Services started!${NC}"
        pm2 status
    fi
fi
