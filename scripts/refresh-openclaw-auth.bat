@echo off
title OpenClaw — Switch to Claude Code / Sonnet
echo.
echo ====================================================
echo  Switching OpenClaw to use Claude Code auth (Sonnet)
echo  No API key needed — uses your claude CLI session
echo ====================================================
echo.
openclaw models auth login --provider anthropic --method claude-code
echo.
echo Setting model to claude-sonnet-4-6...
openclaw models set anthropic/claude-sonnet-4-6
openclaw gateway restart
echo.
echo Done! Verifying...
openclaw models status
pause
