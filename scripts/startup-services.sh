#!/bin/bash
# Startup script for Rohan's core services
# Run: bash ~/startup-services.sh

echo "=== Starting Core Services ==="

# 1. OpenClaw
echo ""
echo "[1/4] OpenClaw..."
bash ~/openclaw-healthcheck.sh 2>&1

# 2. n8n (port 5678)
echo ""
echo "[2/5] n8n Workflow Automation..."
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

# 3. Paperclip (port 3100)
echo ""
echo "[3/5] Paperclip..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/api/health 2>/dev/null | grep -q 200; then
  echo -e "\e[32m[OK]\e[0m Paperclip already running on :3100"
else
  echo "Starting Paperclip..."
  cd ~/paperclip && pnpm dev:server > /tmp/paperclip.log 2>&1 &
  for i in $(seq 1 15); do
    sleep 1
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/api/health 2>/dev/null | grep -q 200; then
      echo -e "\e[32m[OK]\e[0m Paperclip started on :3100"
      break
    fi
    if [ $i -eq 15 ]; then
      echo -e "\e[31m[FAIL]\e[0m Paperclip failed to start — check /tmp/paperclip.log"
    fi
  done
fi

# 3. NERV Dashboard (port 5555)
echo ""
echo "[4/5] NERV Dashboard..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5555/ 2>/dev/null | grep -q 200; then
  echo -e "\e[32m[OK]\e[0m Dashboard already running on :5555"
else
  echo "Starting Dashboard (webpack mode)..."
  cd ~/aeon/dashboard && npx next dev --webpack --port 5555 > /tmp/dashboard.log 2>&1 &
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

# 4. Obsidian Sync
echo ""
echo "[5/5] Obsidian Sync..."
node "$HOME/.claude/hooks/memory-obsidian-sync.js" 2>&1

echo ""
echo "=== Startup Complete ==="
echo "  OpenClaw:  healthcheck ran"
echo "  n8n:       http://localhost:5678"
echo "  Paperclip: http://localhost:3100"
echo "  Dashboard: http://localhost:5555"
echo "  Companies: http://localhost:5555/companies"
echo "  NERV:      http://localhost:5555/nerv"
echo "  Obsidian:  synced (memory + aeon logs + CLAUDE.md)"
