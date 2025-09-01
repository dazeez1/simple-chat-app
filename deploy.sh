#!/bin/bash

# Simple Chat App - Vercel Deployment Script
echo "🚀 Preparing Simple Chat App for Vercel Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if all files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Uncommitted changes detected. Please commit your changes first:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    echo "   git push origin main"
    exit 1
fi

echo "✅ All changes committed. Ready for deployment!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment completed!"
echo "📱 Your chat app is now live on Vercel!"
echo "🔗 Check your Vercel dashboard for the live URL"
