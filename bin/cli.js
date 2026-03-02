#!/usr/bin/env node

'use strict';

const fs     = require('fs');
const path   = require('path');
const rl     = require('readline');
const os     = require('os');
const cp     = require('child_process');

// ── Colours ──────────────────────────────────────────────────────────────────
const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
};

// ── Paths ─────────────────────────────────────────────────────────────────────
const PKG_ROOT = path.join(__dirname, '..');
const CWD      = process.cwd();

// ── Tool definitions ──────────────────────────────────────────────────────────
const TOOLS = [
  {
    key:     'copilot',
    aliases: ['copilot', 'vscode', 'vs-code', 'github-copilot'],
    label:   'GitHub Copilot (VS Code)',
    hint:    '.github/copilot-instructions.md',
    files:   [{ src: '.github/copilot-instructions.md', dest: '.github/copilot-instructions.md' }],
  },
  {
    key:     'cursor-legacy',
    aliases: ['cursor-legacy', 'cursorrules'],
    label:   'Cursor (legacy)',
    hint:    '.cursorrules',
    files:   [{ src: '.cursorrules', dest: '.cursorrules' }],
  },
  {
    key:     'cursor',
    aliases: ['cursor', 'cursor-modern'],
    label:   'Cursor (modern — recommended)',
    hint:    '.cursor/rules/*.mdc',
    files:   [{ src: '.cursor/rules', dest: '.cursor/rules', isDir: true }],
  },
  {
    key:     'claude',
    aliases: ['claude', 'claude-code', 'anthropic'],
    label:   'Claude Code / Claude.ai Projects',
    hint:    'CLAUDE.md',
    files:   [{ src: 'CLAUDE.md', dest: 'CLAUDE.md' }],
  },
  {
    key:     'cline',
    aliases: ['cline', 'roo', 'roocode', 'windsurf'],
    label:   'Cline / Roo Code / Windsurf',
    hint:    '.clinerules',
    files:   [{ src: '.clinerules', dest: '.clinerules' }],
  },
];

// ── File helpers ──────────────────────────────────────────────────────────────
function copyDir(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  fs.mkdirSync(destDir, { recursive: true });
  let count = 0;
  for (const entry of entries) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) count += copyDir(s, d);
    else { fs.copyFileSync(s, d); count++; }
  }
  return count;
}

function fileExists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function applyTool(tool) {
  let total = 0;
  for (const f of tool.files) {
    const src  = path.join(PKG_ROOT, f.src);
    const dest = path.join(CWD, f.dest);
    if (f.isDir) {
      const n = copyDir(src, dest);
      console.log(`  ${c.green('✓')} ${f.dest}/ ${c.dim(`(${n} files)`)}`);
      total += n;
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const existed = fileExists(dest);
      fs.copyFileSync(src, dest);
      const tag = existed ? c.yellow(' (overwritten)') : '';
      console.log(`  ${c.green('✓')} ${f.dest}${tag}`);
      total++;
    }
  }
  return total;
}

// ── Interactive prompt ────────────────────────────────────────────────────────
function promptTools() {
  return new Promise(resolve => {
    console.log(c.bold('  Select tools (comma-separated numbers or "all"):'));
    console.log('');
    TOOLS.forEach((t, i) =>
      console.log(`  ${c.cyan(`${i + 1}.`)} ${t.label.padEnd(36)} ${c.dim(t.hint)}`));
    console.log('');

    const iface = rl.createInterface({ input: process.stdin, output: process.stdout });
    iface.question('  › ', answer => {
      iface.close();
      const input = answer.trim().toLowerCase();
      if (!input || input === 'all') return resolve(TOOLS);
      const selected = input.split(',').map(s => s.trim()).map(s => {
        const n = parseInt(s, 10);
        if (!isNaN(n) && n >= 1 && n <= TOOLS.length) return TOOLS[n - 1];
        return TOOLS.find(t => t.key === s || t.aliases.includes(s));
      }).filter(Boolean);
      resolve([...new Set(selected)]);
    });
  });
}

// ── Remote (GitHub URL / user/repo) ──────────────────────────────────────────

// Skill file candidates that any oz-compatible repo may contain
const SKILL_CANDIDATES = [
  { src: '.github/copilot-instructions.md', dest: '.github/copilot-instructions.md', label: 'GitHub Copilot' },
  { src: '.cursorrules',                    dest: '.cursorrules',                    label: 'Cursor (legacy)' },
  { src: '.cursor/rules',                   dest: '.cursor/rules',                   label: 'Cursor (modern)', isDir: true },
  { src: 'CLAUDE.md',                       dest: 'CLAUDE.md',                       label: 'Claude' },
  { src: '.clinerules',                     dest: '.clinerules',                     label: 'Cline / Roo / Windsurf' },
  { src: 'resources',                       dest: 'resources',                       label: 'Skill sources',   isDir: true },
];

function isRemoteArg(arg) {
  return (
    arg.startsWith('https://') ||
    arg.startsWith('http://')  ||
    arg.startsWith('github:')  ||
    /^[\w.-]+\/[\w.-]+(\.git)?$/.test(arg)
  );
}

function toGitUrl(arg) {
  if (arg.startsWith('https://') || arg.startsWith('http://')) return arg;
  if (arg.startsWith('github:')) return `https://github.com/${arg.slice(7)}`;
  return `https://github.com/${arg}`;
}

function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function addFromRemote(url) {
  const tmpDir = path.join(os.tmpdir(), `oz-skills-remote-${Date.now()}`);
  const displayUrl = url.replace(/\.git$/, '');

  console.log(`  ${c.cyan('↓')} Cloning ${c.bold(displayUrl)} …`);
  console.log('');

  try {
    cp.execSync(`git clone --depth 1 ${url} "${tmpDir}"`, { stdio: 'pipe' });
  } catch (e) {
    rmrf(tmpDir);
    const msg = e.stderr ? e.stderr.toString().trim() : e.message;
    throw new Error(`git clone failed:\n    ${msg}`);
  }

  let totalFiles = 0;
  let found = 0;

  for (const candidate of SKILL_CANDIDATES) {
    const src  = path.join(tmpDir, candidate.src);
    const dest = path.join(CWD, candidate.dest);

    if (!fs.existsSync(src)) continue;

    found++;
    const stat = fs.statSync(src);

    if (candidate.isDir || stat.isDirectory()) {
      const n = copyDir(src, dest);
      console.log(`  ${c.green('✓')} ${candidate.dest}/ ${c.dim(`(${n} files)`)}  ${c.dim(`← ${candidate.label}`)}`);
      totalFiles += n;
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const existed = fileExists(dest);
      fs.copyFileSync(src, dest);
      const tag = existed ? c.yellow(' (overwritten)') : '';
      console.log(`  ${c.green('✓')} ${candidate.dest}${tag}  ${c.dim(`← ${candidate.label}`)}`);
      totalFiles++;
    }
  }

  rmrf(tmpDir);

  if (found === 0) {
    console.log(c.yellow('  ⚠  No recognised skill files found in that repo.'));
    console.log(c.dim('     Expected one or more of: ' + SKILL_CANDIDATES.map(f => f.src).join(', ')));
    console.log('');
    return;
  }

  console.log('');
  console.log(c.green(c.bold('  ✓ Done!')), c.dim(`${totalFiles} file${totalFiles !== 1 ? 's' : ''} added from ${displayUrl}`));
  console.log('');
}

// ── Help ──────────────────────────────────────────────────────────────────────
function printHelp() {
  console.log(c.bold('  Usage:'));
  console.log('');
  console.log(`    ${c.cyan('npx oz-skills add')}                              ${c.dim('Interactive tool picker')}`);
  console.log(`    ${c.cyan('npx oz-skills add --all')}                         ${c.dim('Add all integrations')}`);
  console.log(`    ${c.cyan('npx oz-skills add copilot cursor')}                ${c.dim('Add specific tools')}`);
  console.log(`    ${c.cyan('npx oz-skills add https://github.com/user/repo')} ${c.dim('Add skills from a remote GitHub repo')}`);
  console.log(`    ${c.cyan('npx oz-skills add user/repo')}                     ${c.dim('Shorthand for github.com/user/repo')}`);
  console.log('');
  console.log(c.bold('  Available tools:'));
  console.log('');
  TOOLS.forEach(t =>
    console.log(`    ${c.cyan(t.key.padEnd(16))} ${t.label}  ${c.dim(t.hint)}`));
  console.log('');
  console.log(c.bold('  Tool aliases:'));
  console.log('');
  TOOLS.forEach(t =>
    console.log(`    ${c.dim(t.aliases.join(', '))}`));
  console.log('');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  console.log('');
  console.log(c.bold(c.cyan('  🛡  oz-skills')));
  console.log(c.dim('  OpenZeppelin v5.x rules for AI coding assistants'));
  console.log('');

  const cmd = args[0];

  if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
    printHelp();
    return;
  }

  if (!cmd || cmd === 'add') {
    const toolArgs = args.slice(cmd === 'add' ? 1 : 0);

    // ── Remote repo shortcut ─────────────────────────────────────────────────
    const remoteArg = toolArgs.find(isRemoteArg);
    if (remoteArg) {
      console.log('');
      await addFromRemote(toGitUrl(remoteArg));
      return;
    }

    const hasAll   = toolArgs.includes('--all') || toolArgs.includes('all');

    let selected;

    if (hasAll) {
      selected = TOOLS;
    } else if (toolArgs.length > 0) {
      selected = toolArgs.map(a =>
        TOOLS.find(t => t.key === a.toLowerCase() || t.aliases.includes(a.toLowerCase()))
      ).filter(Boolean);

      if (selected.length === 0) {
        console.error(c.red(`  No matching tools for: ${toolArgs.join(', ')}`));
        console.log(`  Run ${c.cyan('npx oz-skills --help')} to see available tools.`);
        process.exit(1);
      }
    } else {
      selected = await promptTools();
    }

    if (selected.length === 0) {
      console.log(c.yellow('  Nothing selected. Exiting.'));
      return;
    }

    console.log('');
    let totalFiles = 0;
    for (const tool of selected) {
      console.log(`  ${c.bold(tool.label)}`);
      totalFiles += applyTool(tool);
      console.log('');
    }

    console.log(c.green(c.bold('  ✓ Done!')), c.dim(`${totalFiles} file${totalFiles !== 1 ? 's' : ''} added to ${CWD}`));
    console.log('');
    return;
  }

  console.error(c.red(`  Unknown command: "${cmd}"`));
  console.log(`  Run ${c.cyan('npx oz-skills --help')} for usage.`);
  process.exit(1);
}

main().catch(err => {
  console.error(c.red('\n  Error:'), err.message);
  process.exit(1);
});
