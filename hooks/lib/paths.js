const fs = require('fs');
const os = require('os');
const path = require('path');

function homeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}

function userName() {
  return process.env.CLAUDE_SETUP_USER || process.env.USERNAME || process.env.USER || os.userInfo().username;
}

function claudeProjectKey() {
  if (process.env.CLAUDE_PROJECT_MEMORY_KEY) return process.env.CLAUDE_PROJECT_MEMORY_KEY;
  return process.platform === 'win32' ? `C--Users-${userName()}` : `-Users-${userName()}`;
}

function claudeMemoryDir() {
  return path.join(homeDir(), '.claude', 'projects', claudeProjectKey(), 'memory');
}

function vaultBase() {
  if (process.env.VAULT_PATH) return process.env.VAULT_PATH;

  const home = homeDir();
  const candidates = [
    path.join(home, 'Downloads', 'Agentic knowledge'),
    path.join(home, 'OneDrive', 'Documents', 'Agentic knowledge'),
    path.join(home, 'Library', 'CloudStorage', 'OneDrive-Personal', 'Documents', 'Agentic knowledge'),
    path.join(home, 'Documents', 'Agentic knowledge'),
  ];

  const existing = candidates.find(candidate => fs.existsSync(candidate));
  if (existing) return existing;

  return process.platform === 'win32'
    ? path.join(home, 'OneDrive', 'Documents', 'Agentic knowledge')
    : path.join(home, 'Documents', 'Agentic knowledge');
}

module.exports = {
  claudeMemoryDir,
  claudeProjectKey,
  homeDir,
  vaultBase,
};
