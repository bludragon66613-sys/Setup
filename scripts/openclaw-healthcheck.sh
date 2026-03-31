#!/bin/bash
# OpenClaw Health Check & Auto-Fix Script
# Run: bash ~/openclaw-healthcheck.sh
# Checks for common issues and fixes them automatically.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }

echo "=== OpenClaw Health Check ==="
echo ""

# 1. Check gateway is running
GATEWAY_PID=$(powershell -c "Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { (Get-CimInstance Win32_Process -Filter \"ProcessId=\$(\$_.Id)\").CommandLine -like '*openclaw*gateway*' } | Select-Object -ExpandProperty Id" 2>/dev/null | tr -d '\r\n')

if [ -z "$GATEWAY_PID" ]; then
  fail "Gateway not running. Starting..."
  openclaw gateway start
  sleep 3
  ok "Gateway started"
else
  ok "Gateway running (PID $GATEWAY_PID)"
fi

# 2. Check for duplicate gateway processes
GATEWAY_COUNT=$(powershell -c "(Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { (Get-CimInstance Win32_Process -Filter \"ProcessId=\$(\$_.Id)\").CommandLine -like '*openclaw*gateway*' }).Count" 2>/dev/null | tr -d '\r\n')

if [ "$GATEWAY_COUNT" -gt 1 ] 2>/dev/null; then
  fail "Multiple gateway instances ($GATEWAY_COUNT). Restarting..."
  openclaw gateway restart
  sleep 3
  ok "Restarted to single instance"
else
  ok "Single gateway instance"
fi

# 3. Check for zombie gateway.cmd shells
ZOMBIE_COUNT=$(powershell -c "(Get-Process -Name cmd -ErrorAction SilentlyContinue | Where-Object { (Get-CimInstance Win32_Process -Filter \"ProcessId=\$(\$_.Id)\").CommandLine -like '*gateway.cmd*' }).Count" 2>/dev/null | tr -d '\r\n')

if [ "$ZOMBIE_COUNT" -gt 1 ] 2>/dev/null; then
  warn "Multiple gateway.cmd shells ($ZOMBIE_COUNT). Cleaning..."
  powershell -c "Get-WmiObject Win32_Process | Where-Object { \$_.Name -eq 'cmd.exe' -and \$_.CommandLine -like '*gateway.cmd*' } | Sort-Object ProcessId | Select-Object -Skip 1 | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force }"
  ok "Cleaned zombie shells"
else
  ok "No zombie gateway shells"
fi

# 4. Check Telegram channel
TELEGRAM_OK=$(openclaw status 2>&1 | grep -c "Telegram.*ON.*OK" || true)
if [ "$TELEGRAM_OK" -ge 1 ]; then
  ok "Telegram channel: ON + OK"
else
  fail "Telegram channel issue. Check: openclaw status --deep"
fi

# 5. Check Claude Code telegram plugin is disabled
PLUGIN_DISABLED=$(grep -c '"telegram@claude-plugins-official": false' ~/.claude/settings.json 2>/dev/null || true)
if [ "$PLUGIN_DISABLED" -ge 1 ]; then
  ok "Claude Code telegram plugin: disabled (no 409 conflict)"
else
  warn "Claude Code telegram plugin may be enabled — risk of 409 conflict"
  echo "  Fix: Set telegram@claude-plugins-official to false in ~/.claude/settings.json"
fi

# 6. Check GitHub Actions Messages workflow is disabled
GH_WF_STATE=$(gh api repos/bludragon66613-sys/NERV_02/actions/workflows --jq '.workflows[] | select(.name == "Messages") | .state' 2>/dev/null || echo "unknown")
if [ "$GH_WF_STATE" = "disabled_manually" ]; then
  ok "GitHub Actions Messages workflow: disabled"
elif [ "$GH_WF_STATE" = "active" ]; then
  fail "GitHub Actions Messages workflow is ACTIVE — will cause 409 conflicts"
  echo "  Fix: gh api -X PUT repos/bludragon66613-sys/NERV_02/actions/workflows/249454262/disable"
else
  warn "Could not check GitHub Actions workflow state"
fi

# 7. Check model auth
AUTH_INFO=$(openclaw models status 2>&1)
OPENAI_OK=$(echo "$AUTH_INFO" | grep -c "openai-codex.*ok" || true)
if [ "$OPENAI_OK" -ge 1 ]; then
  ok "OpenAI Codex auth: valid"
else
  fail "OpenAI Codex auth may be expired"
  echo "  Fix: openclaw models auth login --provider openai-codex"
fi

echo ""
echo "=== Health Check Complete ==="
