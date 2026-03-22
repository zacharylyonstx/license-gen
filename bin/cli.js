#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { licenses } = require('../lib/templates');

// Colors
const bold = s => `\x1b[1m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const cyan = s => `\x1b[36m${s}\x1b[0m`;
const yellow = s => `\x1b[33m${s}\x1b[0m`;
const dim = s => `\x1b[2m${s}\x1b[0m`;
const red = s => `\x1b[31m${s}\x1b[0m`;

const args = process.argv.slice(2);
const flags = {};
const positional = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--name' && args[i + 1]) { flags.name = args[++i]; }
  else if (args[i] === '--year' && args[i + 1]) { flags.year = args[++i]; }
  else if (args[i] === '--output' && args[i + 1]) { flags.output = args[++i]; }
  else if (args[i] === '--help' || args[i] === '-h') { flags.help = true; }
  else if (args[i] === '--version' || args[i] === '-v') { flags.version = true; }
  else { positional.push(args[i]); }
}

if (flags.version) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

if (flags.help || positional.length === 0) {
  console.log(`${bold('license-gen')} — Generate LICENSE files from the command line\n`);
  console.log(`${bold('Usage:')}`);
  console.log(`  ${cyan('npx license-gen mit')}              Generate MIT license`);
  console.log(`  ${cyan('npx license-gen list')}             Show available licenses`);
  console.log(`  ${cyan('npx license-gen apache --name "Name"')}  Override author name`);
  console.log(`  ${cyan('npx license-gen bsd-3 --year 2025')}     Override year\n`);
  console.log(`${bold('Options:')}`);
  console.log(`  ${yellow('--name')} ${dim('<name>')}    Author name (default: git config user.name)`);
  console.log(`  ${yellow('--year')} ${dim('<year>')}    Year (default: current year)`);
  console.log(`  ${yellow('--output')} ${dim('<file>')}  Output file (default: LICENSE)`);
  console.log(`  ${yellow('--help')}            Show this help`);
  console.log(`  ${yellow('--version')}         Show version\n`);
  console.log(`Run ${cyan('npx license-gen list')} to see all available licenses.`);
  process.exit(0);
}

const command = positional[0].toLowerCase();

if (command === 'list') {
  console.log(`\n${bold('Available Licenses:')}\n`);
  const seen = new Set();
  for (const [key, val] of Object.entries(licenses)) {
    if (seen.has(val.spdx)) continue;
    seen.add(val.spdx);
    console.log(`  ${cyan(key.padEnd(14))} ${val.name} ${dim(`(${val.spdx})`)}`);
  }
  console.log(`\n${dim('Usage: npx license-gen <name>')}\n`);
  process.exit(0);
}

// Find license
const license = licenses[command];
if (!license) {
  console.error(`${red('✗')} Unknown license: "${command}"`);
  console.error(`Run ${cyan('npx license-gen list')} to see available licenses.`);
  
  // Fuzzy suggest
  const keys = [...new Set(Object.values(licenses).map(l => l.spdx))];
  const close = Object.keys(licenses).filter(k => {
    const a = k.replace(/[^a-z0-9]/g, '');
    const b = command.replace(/[^a-z0-9]/g, '');
    return a.includes(b) || b.includes(a);
  });
  if (close.length > 0) {
    console.error(`\nDid you mean: ${close.map(c => cyan(c)).join(', ')}?`);
  }
  process.exit(1);
}

// Get author name
let authorName = flags.name;
if (!authorName) {
  try {
    authorName = execSync('git config user.name', { encoding: 'utf8' }).trim();
  } catch {
    // Try package.json
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
      if (typeof pkg.author === 'string') authorName = pkg.author.replace(/<.*>/, '').trim();
      else if (pkg.author && pkg.author.name) authorName = pkg.author.name;
    } catch {}
  }
}

if (!authorName) {
  console.error(`${red('✗')} Could not detect author name.`);
  console.error(`Use ${yellow('--name "Your Name"')} to specify it.`);
  process.exit(1);
}

const year = flags.year || new Date().getFullYear().toString();
const outputFile = flags.output || 'LICENSE';

// Generate
const content = license.template
  .replace(/\[year\]/g, year)
  .replace(/\[fullname\]/g, authorName);

const outputPath = path.join(process.cwd(), outputFile);

// Check existing
if (fs.existsSync(outputPath)) {
  console.log(`${yellow('⚠')} ${outputFile} already exists. Overwriting.`);
}

fs.writeFileSync(outputPath, content + '\n');

console.log(`\n${green('✓')} Generated ${bold(outputFile)} — ${license.name}`);
console.log(`  ${dim('Author:')} ${authorName}`);
console.log(`  ${dim('Year:')}   ${year}`);
console.log(`  ${dim('SPDX:')}   ${license.spdx}\n`);
