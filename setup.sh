#!/bin/bash

# DOKZ STORE Setup Script
# Run this to setup the entire project

echo "🚀 DOKZ STORE Setup"
echo "==================="
echo ""

# Check if docker is installed
if ! command -v docker &> /dev/null
then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker found"
echo ""

# Start docker compose
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services
sleep 10

echo ""
echo "✅ Services started!"
echo ""
echo "📍 Services running:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:5000"
echo "   - Database: localhost:3306"
echo ""
echo "👤 Test Account:"
echo "   - Email: admin@example.com"
echo "   - Password: admin123"
echo ""
echo "🤝 Default Admin:"
echo "   - role: admin (set manually in DB)"
echo ""
echo "Next steps:"
echo "1. Access http://localhost:3000"
echo "2. Create an account or use test account"
echo "3. Admin panel at /admin (after role set)"
echo ""
echo "📚 Documentation: See README.md"
echo ""
echo "✨ Happy coding!"
