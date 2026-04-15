#!/bin/bash
# Startup script for Rohan's core services
# Run: bash ~/startup-services.sh

echo "=== Starting Core Services ==="

# 0. Cleanup: kill orphaned node processes from previous sessions
# All kills run inside PowerShell via Stop-Process to avoid:
#   - Self-referential query matching (bash/powershell own process tree)
#   - Unreliable SIGTERM delivery from Git Bash to Windows-native node.exe
echo ""
echo "[0/6] Process Cleanup..."
CLEANUP_COUNT=$(powershell.exe -NoProfile -Command '
  $killed = 0
  # Dedup claude-mem MCP servers (keep oldest, kill duplicates)
  $mcps = @(Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq "node.exe" -and $_.CommandLine -like "*claude-mem*mcp-server*"
  } | Sort-Object CreationDate)
  if ($mcps.Count -gt 1) {
    $mcps | Select-Object -Skip 1 | ForEach-Object {
      Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; $killed++
    }
  }
  # Kill orphaned chrome-devtools-mcp processes (on-demand only now)
  Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq "node.exe" -and $_.CommandLine -like "*chrome-devtools-mcp*"
  } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; $killed++ }
  # Kill stale raw pnpm dev:server processes (PM2 manages Paperclip now)
  Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq "node.exe" -and (
      $_.CommandLine -like "*pnpm*dev:server*" -or
      $_.CommandLine -like "*pnpm*--filter*server*dev*"
    ) -and $_.CommandLine -notlike "*pm2*"
  } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; $killed++ }
  Write-Output $killed
' 2>/dev/null | tr -d '\r')

if [ "${CLEANUP_COUNT:-0}" -gt 0 ]; then
  echo -e "\e[33m[CLEANED]\e[0m Killed $CLEANUP_COUNT orphaned processes"
else
  echo -e "\e[32m[OK]\e[0m No orphaned processes found"
fi

# 1. OpenClaw
echo ""
echo "[1/6] OpenClaw..."
bash ~/openclaw-healthcheck.sh 2>&1

# 2. n8n (port 5678)
echo ""
echo "[2/6] n8n Workflow Automation..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz 2>/dev/null | grep -q 200; then
  echo -e "\e[32m[OK]\e[0m n8n already running on :5678"
else
  echo "Starting n8n..."
  N8N_DIAGNOSTICS_ENABLED=false N8N_PERSONALIZATION_ENABLED=false node "$HOME/AppData/Roaming/npm/node_modules/n8n/bin/n8n" start > /tmp/n8n.log 2>&1 &
  for i in $(seq 1 30); do
    sleep 1
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz 2>/dev/null | grep -q 200; then
      echo -e "\e[32m[OK]\e[0m n8n started on :5678"
      break
    fi
    if [ $i -eq 30 ]; then
      echo -e "\e[33m[WARN]\e[0m n8n still starting — check /tmp/n8n.log"
    fi
  done
fi

# 3. Paperclip (port 3100) — managed by PM2, never raw pnpm
echo ""
echo "[3/6] Paperclip (via PM2)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/api/health 2>/dev/null | grep -q 200; then
  echo -e "\e[32m[OK]\e[0m Paperclip already running on :3100"
else
  echo "Starting Paperclip via PM2..."
  pm2 restart paperclip --update-env 2>/dev/null || {
    echo "  First start — registering with PM2..."
    pm2 start "pnpm dev:server" --name paperclip --cwd "$HOME/paperclip" 2>/dev/null
  }
  for i in $(seq 1 15); do
    sleep 1
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/api/health 2>/dev/null | grep -q 200; then
      echo -e "\e[32m[OK]\e[0m Paperclip started on :3100 (PM2)"
      break
    fi
    if [ $i -eq 15 ]; then
      echo -e "\e[31m[FAIL]\e[0m Paperclip failed to start — check: pm2 logs paperclip"
    fi
  done
fi

# 4. NERV Dashboard (port 5555)
echo ""
echo "[4/6] NERV Dashboard..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5555/ 2>/dev/null | grep -q 200; then
  echo -e "\e[32m[OK]\e[0m Dashboard already running on :5555"
else
  echo "Starting Dashboard (webpack mode)..."
  (cd ~/aeon/dashboard && npx next dev --webpack --port 5555 > /tmp/dashboard.log 2>&1 &)
  for i in $(seq 1 20); do
    sleep 1
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5555/ 2>/dev/null | grep -q 200; then
      echo -e "\e[32m[OK]\e[0m Dashboard started on :5555"
      break
    fi
    if [ $i -eq 20 ]; then
      echo -e "\e[31m[FAIL]\e[0m Dashboard failed to start — check /tmp/dashboard.log"
    fi
  done
fi

# 5. Obsidian Sync
echo ""
echo "[5/6] Obsidian Sync..."
node "$HOME/.claude/hooks/memory-obsidian-sync.js" 2>&1

# 6. Auth Expiry Check
echo ""
echo "[6/6] Auth Expiry Check..."
node -e "
const fs = require('fs');
const path = require('path');
const f = path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw/agents/main/agent/auth-profiles.json');
if (!fs.existsSync(f)) { console.log('  No auth profiles found'); process.exit(0); }
const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const now = Date.now();
let warnings = 0;
for (const [k,v] of Object.entries(d.profiles || d)) {
  if (!v || !v.expires) continue;
  const exp = new Date(typeof v.expires === 'number' && v.expires > 1e12 ? v.expires : v.expires * 1000);
  const days = Math.round((exp - now) / 86400000);
  if (days < 0) { console.log('  \x1b[31m[EXPIRED]\x1b[0m ' + k + ' expired ' + Math.abs(days) + ' days ago'); warnings++; }
  else if (days <= 3) { console.log('  \x1b[33m[WARN]\x1b[0m ' + k + ' expires in ' + days + ' days (' + exp.toISOString().slice(0,10) + ')'); warnings++; }
  else { console.log('  \x1b[32m[OK]\x1b[0m ' + k + ' expires in ' + days + ' days'); }
}
if (warnings === 0) console.log('  All auth tokens healthy');
" 2>/dev/null || echo "  Auth check skipped"

echo ""
echo "=== Startup Complete ==="
echo "  OpenClaw:  healthcheck ran"
echo "  n8n:       http://localhost:5678"
echo "  Paperclip: http://localhost:3100"
echo "  Dashboard: http://localhost:5555"
echo "  Companies: http://localhost:5555/companies"
echo "  NERV:      http://localhost:5555/nerv"
echo "  Obsidian:  synced (memory + aeon logs + CLAUDE.md)"
