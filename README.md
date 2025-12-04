# 🤖 Sentinel - AI CI/CD Repair Agent

**Automatically fix your build failures with AI. Deploy once, integrate everywhere.**

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fsentinel)

## 🚀 Quick Start (5 minutes)

### **1. Run Setup Script**
```bash
# Windows
./setup.ps1

# macOS/Linux
chmod +x setup.sh && ./setup.sh
```

### **2. Deploy to Vercel**
```bash
vercel --prod
```

### **3. Set Environment Variables**
In Vercel dashboard → Settings → Environment Variables:
```
GEMINI_API_KEY=your_google_gemini_key
GITHUB_TOKEN=ghp_your_github_token
SENTINEL_API_KEY=your_generated_api_key
```

### **4. Your API URL**
After deploy: `https://your-project.vercel.app`

### **5. Add to Any Repository**
Create `.github/workflows/sentinel-fix.yml`:
```yaml
name: 🤖 Sentinel Auto-Fix
on: [workflow_run]
jobs:
  fix:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'failure'
    steps:
      - uses: your-username/sentinel@main
        with:
          sentinel-api-url: 'https://your-project.vercel.app'
          sentinel-api-key: ${{ secrets.SENTINEL_API_KEY }}
```

## 🎯 What It Does

**Before:** Build fails → Developer spends 30-60 minutes debugging
**After:** Build fails → Sentinel creates a fix PR in 2 minutes

### Example Workflow:
1. ❌ CI fails with `TypeError: Cannot read property 'foo' of undefined`
2. 🤖 Sentinel analyzes error logs + source code
3. ✅ Creates PR: `🤖 Auto-fix: Added null check` with working code
4. 👀 Developer reviews diff, merges

## 🧪 Test It Now (3 Ways)

### **Method 1: Local Web UI (Easiest)**
```bash
npm run dev  # Visit http://localhost:3000
```
- Paste any error log + code
- Watch AI agents think in real-time
- Copy the generated fix

### **Method 2: API Test (1 command)**
```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"errorLogs":"TypeError: Cannot read property foo","sourceCode":"console.log(data.foo)"}'
```

### **Method 3: Real CI/CD (After Deploy)**
1. Deploy to Vercel (see Quick Start)
2. Add workflow to any repo
3. Break a build intentionally
4. Watch Sentinel create a fix PR in minutes

## 🔧 Configuration

### Environment Variables
```bash
# Required
GEMINI_API_KEY=your_key_from_aistudio.google.com
GITHUB_TOKEN=ghp_your_github_token

# Optional
SENTINEL_API_KEY=custom_api_key_for_security
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### GitHub Action Options
```yaml
- uses: your-username/sentinel@main
  with:
    sentinel-api-url: 'https://your-app.vercel.app'
    sentinel-api-key: ${{ secrets.SENTINEL_API_KEY }}
    retry-depth: 3  # 1-3 attempts
    base-branch: 'main'
    file-patterns: '*.js,*.ts,*.py'
```

## 📚 API Reference

### POST `/api/agent`
Fix code with AI agents.

**Request:**
```json
{
  "errorLogs": "string - CI/CD error output",
  "sourceCode": "string - source code to fix",
  "retryDepth": "number - 1-3 (optional)",
  "github": {
    "repo": "owner/repo",
    "sha": "commit_hash",
    "workflow": "workflow_name"
  }
}
```

**Response:**
```json
{
  "success": true,
  "pr_url": "https://github.com/.../pull/...",
  "fix_summary": "Fixed null reference error",
  "attempts": 1
}
```

## 🏗️ Architecture

- **Frontend:** Next.js 14 + Windows 95 UI + shadcn/ui
- **AI:** Google Gemini 2.0 + LangGraph multi-agent system
- **Agents:** Diagnostician → Architect → Surgeon → Verifier
- **Streaming:** Real-time thought visibility
- **Validation:** Zod schemas prevent hallucinations

## 💭 Why I Built This

I hate debugging CI failures. Thought I could save few mins each week. Unlike Copilot that just suggests, Sentinel fixes and creates PRs.

## 🔒 Security

- API keys never logged or stored
- GitHub tokens use minimal required permissions
- All fixes require human review before merge
- Open source for transparency

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Add tests for new functionality
4. Submit PR

### Adding New Agent Types
```typescript
// lib/langgraph/nodes/new-agent.ts
export async function newAgentNode(state: AgentState): Promise<AgentState> {
  // Add to graph in lib/langgraph/graph.ts
}
```

## 📄 License

MIT - Build your own CI/CD repair agent!

---

**Built with love for slowly making computers disappear from our workflow, even though I love them.**