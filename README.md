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

**Option A: Copy the example workflow** (recommended)
```bash
# Copy the example workflow from this repo
cp .github/workflows/example-sentinel-fix.yml .github/workflows/sentinel-fix.yml
# Then customize the workflow name and branch in the file
```

**Option B: Create manually**
Create `.github/workflows/sentinel-fix.yml`:
```yaml
name: 🤖 Sentinel Auto-Fix
on:
  workflow_run:
    workflows: ["CI"]  # Trigger on your CI workflow
    types: [completed]
    branches: [main]

jobs:
  fix:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'failure'
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Authenticate GitHub CLI
        run: echo "${{ secrets.GITHUB_TOKEN }}" | gh auth login --with-token

      - name: Get error logs from failed run
        id: error-logs
        run: |
          # Multiple fallback methods for robust error extraction
          LOGS=$(gh run view ${{ github.event.workflow_run.id }} --log 2>&1 || echo "")
          if [ -z "$LOGS" ] || echo "$LOGS" | grep -q "Failed\|not found"; then
            # Fallback to GitHub API
            LOGS=$(curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
              "https://api.github.com/repos/${{ github.repository }}/actions/runs/${{ github.event.workflow_run.id }}/logs" || echo "")
          fi
          ERRORS=$(echo "$LOGS" | grep -i -A 3 -B 3 "error\|failed\|exception\|fail\|cannot\|undefined\|null\|TypeError" | head -200 || echo "$LOGS" | tail -100)
          echo "error_logs<<EOF" >> $GITHUB_OUTPUT
          echo "$ERRORS"
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Smart file detection
        id: source-files
        run: |
          # Step 1: Get changed files from commit diff
          CHANGED=$(git diff --name-only ${{ github.event.workflow_run.head_sha }}~1 ${{ github.event.workflow_run.head_sha }} 2>/dev/null | grep -E '\.(js|ts|jsx|tsx|json)$' || echo "")
          
          # Step 2: Extract file paths from error logs
          ERROR_FILES=$(echo "${{ steps.error-logs.outputs.error_logs }}" | \
            grep -oE '[./]?[a-zA-Z0-9_/-]+\.(js|ts|jsx|tsx|json)[: ]' | \
            sed 's/[: ].*$//' | sed 's|^\./||' | sort -u | \
            grep -v "^node_modules" || echo "")
          
          # Step 3: Combine and limit to max 8 files (token-efficient)
          ALL_FILES=$(echo -e "$CHANGED\n$ERROR_FILES" | grep -v "^$" | sort -u | head -8)
          
          # Step 4: Fallback to common source files if nothing found
          if [ -z "$ALL_FILES" ]; then
            for FILE in "app/page.tsx" "src/app/page.tsx" "pages/index.tsx" "package.json"; do
              [ -f "$FILE" ] && ALL_FILES="$ALL_FILES $FILE"
            done
            ALL_FILES=$(echo "$ALL_FILES" | head -5)
          fi
          
          echo "source_files<<EOF" >> $GITHUB_OUTPUT
          echo "$ALL_FILES"
          echo "EOF" >> $GITHUB_OUTPUT

      - name: 🤖 Call Sentinel API
        id: sentinel-fix
        continue-on-error: true
        run: |
          # Build source code payload (max 8 files, max 50KB each)
          SOURCE_CODE=""
          for FILE in ${{ steps.source-files.outputs.source_files }}; do
            [ -f "$FILE" ] && SOURCE_CODE="$SOURCE_CODE\n--- $FILE ---\n$(head -1000 "$FILE" 2>/dev/null || cat "$FILE")"
          done
          
          # Call Sentinel API
          RESPONSE=$(curl -s -X POST "https://your-project.vercel.app/api/agent" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.SENTINEL_API_KEY }}" \
            -d "{
              \"errorLogs\": $(echo "${{ steps.error-logs.outputs.error_logs }}" | jq -R -s .),
              \"sourceCode\": $(echo "$SOURCE_CODE" | jq -R -s .),
              \"retryDepth\": 3,
              \"github\": {
                \"repo\": \"${{ github.repository }}\",
                \"sha\": \"${{ github.event.workflow_run.head_sha }}\",
                \"workflow\": \"CI\"
              }
            }")
          
          # Parse streaming response
          RESULT=$(echo "$RESPONSE" | grep "^data:" | tail -1 | sed 's/^data: //' || echo "$RESPONSE")
          
          if echo "$RESULT" | jq -e '.success // false' > /dev/null 2>&1; then
            echo "✅ Auto-fix successful!"
            echo "pr_url<<EOF" >> $GITHUB_OUTPUT
            echo "$RESULT" | jq -r '.pr_url'
            echo "EOF" >> $GITHUB_OUTPUT
          else
            echo "❌ Auto-fix failed"
            exit 1
          fi
```

**Or use the simplified action** (if you prefer):
```yaml
- uses: your-username/sentinel-auto-fixer@main
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
- uses: your-username/sentinel-auto-fixer@main
  with:
    sentinel-api-url: 'https://your-app.vercel.app'
    sentinel-api-key: ${{ secrets.SENTINEL_API_KEY }}
    retry-depth: 3  # 1-3 attempts (default: 3)
    base-branch: 'main'  # Branch to create PR against
    file-patterns: '*.js,*.ts,*.py'  # File patterns to analyze
```

**Note**: The workflow automatically:
- Detects changed files from commit diff
- Extracts file paths from error logs
- Limits analysis to max 8 files (token-efficient)
- Falls back to common source files if needed

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

**Built with love for slowly making computers disappear from my workflow, even though I love them.**