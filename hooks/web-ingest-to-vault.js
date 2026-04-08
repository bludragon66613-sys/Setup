#!/usr/bin/env node
/**
 * web-ingest-to-vault.js
 * PostToolUse hook for WebFetch/WebSearch: captures fetched web content
 * into Obsidian vault as searchable notes with frontmatter.
 *
 * Layer 3 of the 3-layer memory system: Ingestion Pipeline
 * Converts external content (articles, research, tweets) into vault notes.
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.USERPROFILE || process.env.HOME;
const VAULT_RAW = path.join(HOME, 'OneDrive', 'Documents', 'Agentic knowledge', 'raw');
const MAX_CONTENT_LENGTH = 8000; // truncate very long content

function sanitizeFilename(str) {
  return str
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
    .replace(/-+$/, '');
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { input += chunk; });
  process.stdin.on('end', () => {
    try {
      const data = JSON.parse(input);
      const toolName = data.tool_name || '';
      const toolInput = data.tool_input || {};
      const toolOutput = data.tool_output || '';

      // Only process WebFetch and WebSearch results
      if (!['WebFetch', 'WebSearch'].includes(toolName)) {
        process.stdout.write(input);
        return;
      }

      // Skip empty or error outputs
      const output = typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput);
      if (!output || output.length < 100 || output.includes('Request failed')) {
        process.stdout.write(input);
        return;
      }

      fs.mkdirSync(VAULT_RAW, { recursive: true });

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toISOString().slice(11, 19).replace(/:/g, '');

      if (toolName === 'WebFetch') {
        const url = toolInput.url || 'unknown';
        const domain = extractDomain(url);
        const prompt = toolInput.prompt || '';
        const slug = sanitizeFilename(domain + '-' + dateStr);
        const filename = `${slug}-${timeStr}.md`;

        const content = [
          '---',
          `title: "Web fetch: ${domain}"`,
          `source: "${url}"`,
          `date: ${dateStr}`,
          `type: web-fetch`,
          `query: "${prompt.slice(0, 120).replace(/"/g, "'")}"`,
          '---',
          '',
          `# ${domain}`,
          `> Fetched: ${now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
          `> URL: ${url}`,
          `> Query: ${prompt}`,
          '',
          output.slice(0, MAX_CONTENT_LENGTH),
          '',
          output.length > MAX_CONTENT_LENGTH ? `\n> [Truncated — ${output.length} chars total]` : '',
        ].join('\n');

        fs.writeFileSync(path.join(VAULT_RAW, filename), content);
        process.stderr.write(`[web-ingest] Saved ${filename} to vault/raw/\n`);
      }

      if (toolName === 'WebSearch') {
        const query = toolInput.query || 'search';
        const slug = sanitizeFilename(query.slice(0, 50));
        const filename = `search-${slug}-${dateStr}-${timeStr}.md`;

        const content = [
          '---',
          `title: "Search: ${query.slice(0, 80)}"`,
          `date: ${dateStr}`,
          `type: web-search`,
          `query: "${query.replace(/"/g, "'")}"`,
          '---',
          '',
          `# Search: ${query}`,
          `> Searched: ${now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
          '',
          output.slice(0, MAX_CONTENT_LENGTH),
          '',
          output.length > MAX_CONTENT_LENGTH ? `\n> [Truncated — ${output.length} chars total]` : '',
        ].join('\n');

        fs.writeFileSync(path.join(VAULT_RAW, filename), content);
        process.stderr.write(`[web-ingest] Saved ${filename} to vault/raw/\n`);
      }

      // Remind about wiki compilation
      process.stderr.write(`[wiki] New raw source captured. Run /wiki-ingest to compile into wiki.\n`);

      // Pass through unchanged
      process.stdout.write(input);
    } catch (err) {
      // Don't block the tool on errors
      process.stderr.write(`[web-ingest] Error: ${err.message}\n`);
      process.stdout.write(input);
    }
  });
}

main();
