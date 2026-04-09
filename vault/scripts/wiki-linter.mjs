// wiki-linter.mjs
// Comprehensive wiki health checker for the LLM Wiki pattern.
// Run: node scripts/wiki-linter.mjs
// Or invoked by /wiki-lint skill.

import { readdir, readFile, stat } from 'fs/promises';
import { resolve, relative, basename, extname } from 'path';

const KB_ROOT = process.env.KB_ROOT || resolve(process.cwd());
const STALE_DAYS = 30;
const NOW = Date.now();

async function listMdFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
      const full = resolve(dir, e.name);
      if (e.isDirectory()) {
        files.push(...(await listMdFiles(full)));
      } else if (e.name.endsWith('.md')) {
        files.push(full);
      }
    }
    return files;
  } catch {
    return [];
  }
}

function extractWikilinks(content) {
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    links.push(m[1].trim());
  }
  return links;
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      fm[key] = val;
    }
  }
  return fm;
}

function resolveLink(link, allPaths, root) {
  // Try exact path
  const candidates = [
    resolve(root, link + '.md'),
    resolve(root, link),
    resolve(root, 'wiki', 'articles', link + '.md'),
    resolve(root, 'wiki', 'entities', link + '.md'),
    resolve(root, 'wiki', 'concepts', link + '.md'),
    resolve(root, 'wiki', 'summaries', link + '.md'),
  ];
  for (const c of candidates) {
    if (allPaths.has(c)) return c;
  }
  // Try matching just the filename
  const name = basename(link);
  for (const p of allPaths) {
    if (basename(p, '.md') === name) return p;
  }
  return null;
}

async function lint() {
  const issues = { critical: [], warning: [], info: [] };
  const stats = {};

  // Collect all markdown files
  const wikiArticles = await listMdFiles(resolve(KB_ROOT, 'wiki', 'articles'));
  const wikiEntities = await listMdFiles(resolve(KB_ROOT, 'wiki', 'entities'));
  const wikiConcepts = await listMdFiles(resolve(KB_ROOT, 'wiki', 'concepts'));
  const wikiSummaries = await listMdFiles(resolve(KB_ROOT, 'wiki', 'summaries'));
  const rawFiles = await listMdFiles(resolve(KB_ROOT, 'raw'));
  const allWiki = [...wikiArticles, ...wikiEntities, ...wikiConcepts, ...wikiSummaries];
  const allFiles = await listMdFiles(KB_ROOT);
  const allPathsSet = new Set(allFiles);

  stats.articles = wikiArticles.length;
  stats.entities = wikiEntities.length;
  stats.concepts = wikiConcepts.length;
  stats.summaries = wikiSummaries.length;
  stats.totalWiki = allWiki.length;
  stats.rawSources = rawFiles.length;

  // Read all wiki file contents
  const fileContents = new Map();
  for (const f of allFiles) {
    try {
      fileContents.set(f, await readFile(f, 'utf8'));
    } catch { /* skip unreadable */ }
  }

  // 1. Broken wikilinks (critical)
  for (const f of allWiki) {
    const content = fileContents.get(f) || '';
    const links = extractWikilinks(content);
    for (const link of links) {
      if (!resolveLink(link, allPathsSet, KB_ROOT)) {
        issues.critical.push({
          type: 'broken_link',
          file: relative(KB_ROOT, f),
          link,
        });
      }
    }
  }

  // 2. Index drift (critical)
  const indexContent = fileContents.get(resolve(KB_ROOT, 'index.md')) || '';
  const indexLinks = extractWikilinks(indexContent);
  const indexLinkedPaths = new Set(
    indexLinks.map(l => resolveLink(l, allPathsSet, KB_ROOT)).filter(Boolean)
  );
  for (const f of allWiki) {
    if (!indexLinkedPaths.has(f)) {
      issues.critical.push({
        type: 'index_missing',
        file: relative(KB_ROOT, f),
        message: 'Wiki page exists on disk but not in index.md',
      });
    }
  }

  // 3. Unprocessed sources (warning)
  const articleSlugs = new Set(wikiArticles.map(f => basename(f, '.md')));
  let processedCount = 0;
  for (const r of rawFiles) {
    const slug = basename(r, '.md');
    // Check if any article references this raw file
    let found = false;
    for (const a of wikiArticles) {
      const content = fileContents.get(a) || '';
      if (content.includes(slug) || content.includes(`raw/${slug}`)) {
        found = true;
        break;
      }
    }
    if (found) {
      processedCount++;
    } else {
      issues.warning.push({
        type: 'unprocessed_source',
        file: relative(KB_ROOT, r),
        message: 'Raw source has no corresponding wiki article',
      });
    }
  }
  stats.processedSources = processedCount;
  stats.unprocessedSources = rawFiles.length - processedCount;

  // 4. Orphan pages (warning)
  const inboundCounts = new Map();
  for (const f of allWiki) inboundCounts.set(f, 0);
  for (const f of allFiles) {
    const content = fileContents.get(f) || '';
    const links = extractWikilinks(content);
    for (const link of links) {
      const target = resolveLink(link, allPathsSet, KB_ROOT);
      if (target && inboundCounts.has(target) && target !== f) {
        inboundCounts.set(target, (inboundCounts.get(target) || 0) + 1);
      }
    }
  }
  for (const [f, count] of inboundCounts) {
    if (count === 0) {
      const name = basename(f, '.md');
      if (!['index', 'log', 'MOC', 'WIKI_SCHEMA', 'MindMap'].includes(name)) {
        issues.warning.push({
          type: 'orphan_page',
          file: relative(KB_ROOT, f),
          message: 'Zero inbound wikilinks',
        });
      }
    }
  }

  // 5. Stale content (warning)
  for (const f of allWiki) {
    const content = fileContents.get(f) || '';
    const fm = extractFrontmatter(content);
    if (fm.updated) {
      const updated = new Date(fm.updated).getTime();
      const daysSince = (NOW - updated) / (1000 * 60 * 60 * 24);
      if (daysSince > STALE_DAYS) {
        issues.warning.push({
          type: 'stale_content',
          file: relative(KB_ROOT, f),
          updated: fm.updated,
          daysSince: Math.floor(daysSince),
        });
      }
    }
  }

  // 6. Missing entity pages (warning)
  const entitySlugs = new Set(wikiEntities.map(f => basename(f, '.md')));
  const entityMentions = new Map();
  for (const a of wikiArticles) {
    const content = fileContents.get(a) || '';
    const fm = extractFrontmatter(content);
    if (Array.isArray(fm.entities)) {
      for (const e of fm.entities) {
        if (!entityMentions.has(e)) entityMentions.set(e, []);
        entityMentions.get(e).push(relative(KB_ROOT, a));
      }
    }
  }
  for (const [entity, articles] of entityMentions) {
    if (articles.length >= 2 && !entitySlugs.has(entity)) {
      issues.warning.push({
        type: 'missing_entity',
        entity,
        mentionedIn: articles,
        message: `Mentioned in ${articles.length} articles but has no entity page`,
      });
    }
  }

  // 7. Cross-reference gaps (info)
  for (const f of wikiArticles) {
    const content = fileContents.get(f) || '';
    if (!content.includes('## See Also') && !content.includes('## Related')) {
      issues.info.push({
        type: 'no_see_also',
        file: relative(KB_ROOT, f),
        message: 'Article has no See Also section',
      });
    }
  }

  // 8. Empty entity Appears In (info)
  for (const f of wikiEntities) {
    const content = fileContents.get(f) || '';
    if (content.includes('## Appears In') && !content.includes('[[')) {
      issues.info.push({
        type: 'empty_appears_in',
        file: relative(KB_ROOT, f),
        message: 'Entity page has empty Appears In section',
      });
    }
  }

  return { issues, stats };
}

// Run
const result = await lint();
console.log(JSON.stringify(result, null, 2));
