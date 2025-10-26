#!/bin/bash

# 🚀 Quick Vercel Deployment Script for Pilgrimage Booking Backend

echo "=================================="
echo "🚀 Deploying to Vercel..."
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI is not installed!"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "✅ Vercel CLI is installed"
echo ""

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add environment variables in Vercel dashboard"
echo "2. Update frontend API URL in js/config.js"
echo "3. Test your deployment"
echo ""
