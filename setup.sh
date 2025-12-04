#!/bin/bash

# Sentinel Setup Script
# Makes deployment and configuration dead simple

echo "🤖 Sentinel Setup"
echo "================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Generate API key
echo "🔑 Generating Sentinel API key..."
API_KEY=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your Google Gemini API key from: https://aistudio.google.com/app/apikey"
echo "2. Create GitHub token at: https://github.com/settings/tokens (with repo, workflow, pull_requests permissions)"
echo "3. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "4. Set these environment variables in Vercel dashboard:"
echo "   GEMINI_API_KEY=your_gemini_key"
echo "   GITHUB_TOKEN=ghp_your_github_token"
echo "   SENTINEL_API_KEY=$API_KEY"
echo ""
echo "5. Your Sentinel API URL will be: https://your-project.vercel.app"
echo ""
echo "6. Test locally first:"
echo "   npm run dev"
echo "   # Then visit http://localhost:3000"
echo ""
echo "7. Add to any repository by creating .github/workflows/sentinel-fix.yml"
echo ""
echo "🎯 Ready to auto-fix CI/CD failures with AI!"
