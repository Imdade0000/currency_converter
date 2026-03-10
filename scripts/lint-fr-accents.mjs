#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const roots = process.argv.slice(2);
const scanRoots = roots.length > 0 ? roots : ['front-end', 'backend/src'];
const includeExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.hbs', '.md']);
const excludeDir = new Set(['node_modules', '.next', 'dist', '.git']);

const BAD_PATTERNS = [
  { regex: /\bAcces\b|\bacces\b/g, suggestion: 'Accès / accès' },
  { regex: /\bDerniere\b|\bderniere\b/g, suggestion: 'Dernière / dernière' },
  { regex: /\btrouvee\b|\btrouvees\b|\bTrouvee\b|\bTrouvees\b/g, suggestion: 'trouvée / trouvées' },
  { regex: /\bsupportees\b|\bSupportees\b/g, suggestion: 'supportées' },
  { regex: /\billimite\b|\billimitees\b|\billimitee\b/g, suggestion: 'illimité / illimitées / illimitée' },
  { regex: /\bdesactive\b|\bdesactivee\b|\bDesactive\b|\bDesactivee\b/g, suggestion: 'désactivé / désactivée' },
  { regex: /\bdepasse\b|\bDepasse\b/g, suggestion: 'dépassé' },
  { regex: /\bfrequence\b|\bFrequence\b/g, suggestion: 'fréquence' },
  { regex: /\breinitial\w*\b|\bReinitial\w*\b/g, suggestion: 'réinitial...' },
  { regex: /\bgenerer\b|\bGenerer\b|\bgenerez\b|\bGenerez\b|\bgeneree\b|\bGeneree\b/g, suggestion: 'générer / générez / générée' },
  { regex: /\bcree\b|\bCree\b|\bcreee\b|\bCreee\b/g, suggestion: 'crée / créée' },
  { regex: /\bavancees\b|\bavancee\b|\bAvancees\b/g, suggestion: 'avancées / avancée' },
  { regex: /\bactualites\b|\bActualites\b/g, suggestion: 'actualités' },
  { regex: /\breel\b|\bReel\b/g, suggestion: 'réel' },
  { regex: /\bmarch[eE]\b/g, suggestion: 'marché (selon contexte)' },
  { regex: /\bdifferentes\b|\bdifferente\b/g, suggestion: 'différentes / différente' },
  { regex: /\bpremiere\b|\bPremiere\b/g, suggestion: 'première' },
  { regex: /\bcreation\b|\bCreation\b/g, suggestion: 'création' },
  { regex: /des que/g, suggestion: 'dès que' },
];

const MOJIBAKE_REGEX = /Ã|Â|â/;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (excludeDir.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
      continue;
    }
    if (includeExt.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function extractQuotedSegments(line) {
  const matches = line.match(/'[^']*'|"[^"]*"|`[^`]*`/g);
  if (!matches) return [];
  return matches.map((m) => m.slice(1, -1));
}

const files = scanRoots.flatMap((root) => walk(root));
const findings = [];

for (const file of files) {
  const ext = path.extname(file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    const segments = ['.ts', '.tsx', '.js', '.jsx'].includes(ext)
      ? extractQuotedSegments(line)
      : [line];

    for (const text of segments) {
      if (!text) continue;

      if (MOJIBAKE_REGEX.test(text)) {
        findings.push({
          type: 'mojibake',
          file,
          line: lineNo,
          text: text.trim(),
          suggestion: 'Corriger encodage UTF-8',
        });
      }

      for (const rule of BAD_PATTERNS) {
        if (rule.regex.test(text)) {
          findings.push({
            type: 'accent',
            file,
            line: lineNo,
            text: text.trim(),
            suggestion: rule.suggestion,
          });
          rule.regex.lastIndex = 0;
        }
      }
    }
  });
}

if (findings.length === 0) {
  console.log('FR accent lint: OK (aucune occurrence suspecte).');
  process.exit(0);
}

console.error(`FR accent lint: ${findings.length} occurrence(s) suspecte(s).`);
for (const f of findings) {
  console.error(`- [${f.type}] ${f.file}:${f.line} | ${f.suggestion}`);
  console.error(`  -> ${f.text}`);
}
process.exit(1);
