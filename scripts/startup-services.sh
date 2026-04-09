#!/bin/bash
# Startup script for Rohan's core services
# Run: bash ~/startup-services.sh

echo "=== Starting Core Services ==="

# 1. OpenClaw
echo ""
echo "[1/2] OpenClaw..."
bash ~/openclaw-healthcheck.sh 2>&1

# 2. Paperclip (port 3100)
echo ""
echo "[2/2] Paperclip..."
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

# NERV Dashboard disabled — start manually with: cd ~/aeon/dashboard && npx next dev --webpack --port 5555

# 3. Obsidian Sync
echo ""
echo "[3/3] Obsidian Sync..."
node "$HOME/.claude/hooks/memory-obsidian-sync.js" 2>&1

echo ""
echo "=== Startup Complete ==="
echo "  OpenClaw:  healthcheck ran"
echo "  Paperclip: http://localhost:3100"
echo "  Obsidian:  synced (memory + aeon logs + CLAUDE.md)"
echo ""
echo "  Dashboard: disabled (run manually: cd ~/aeon/dashboard && npx next dev --webpack --port 5555)"
