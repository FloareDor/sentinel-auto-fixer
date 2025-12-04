# Sentinel Setup Script (Windows)
# Makes deployment and configuration dead simple

Write-Host "🤖 Sentinel Setup" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

# Generate API key
Write-Host "🔑 Generating Sentinel API key..." -ForegroundColor Yellow
$API_KEY = -join ((48..57) + (97..122) | Get-Random -Count 64 | % {[char]$_})

Write-Host "" -ForegroundColor White
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Get your Google Gemini API key from: https://aistudio.google.com/app/apikey" -ForegroundColor White
Write-Host "2. Create GitHub token at: https://github.com/settings/tokens (with repo, workflow, pull_requests permissions)" -ForegroundColor White
Write-Host "3. Deploy to Vercel:" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor Gray
Write-Host "" -ForegroundColor White
Write-Host "4. Set these environment variables in Vercel dashboard:" -ForegroundColor Cyan
Write-Host "   GEMINI_API_KEY=your_gemini_key" -ForegroundColor White
Write-Host "   GITHUB_TOKEN=ghp_your_github_token" -ForegroundColor White
Write-Host "   SENTINEL_API_KEY=$API_KEY" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "5. Your Sentinel API URL will be: https://your-project.vercel.app" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "6. Test locally first:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "   # Then visit http://localhost:3000" -ForegroundColor Gray
Write-Host "" -ForegroundColor White
Write-Host "7. Add to any repository by creating .github/workflows/sentinel-fix.yml" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "🎯 Ready to auto-fix CI/CD failures with AI!" -ForegroundColor Magenta
