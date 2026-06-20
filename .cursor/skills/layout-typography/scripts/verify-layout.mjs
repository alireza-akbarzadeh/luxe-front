#!/usr/bin/env node
/**
 * Verify layout-typography eval outputs.
 * Usage: node scripts/verify-layout.mjs <path-to-output.tsx>
 */
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/verify-layout.mjs <output.tsx>');
  process.exit(1);
}

const src = fs.readFileSync(path.resolve(file), 'utf8');
const results = [];

function pass(name, ok, evidence) {
  results.push({ name, passed: ok, evidence });
}

pass(
  'imports Flex',
  /@\/components\/ui\/flex/.test(src),
  /@\/components\/ui\/flex/.test(src) ? 'Found Flex import' : 'Missing @/components/ui/flex import'
);
pass(
  'imports Grid',
  /@\/components\/ui\/grid['"]/.test(src),
  /@\/components\/ui\/grid/.test(src) ? 'Found Grid import' : 'Missing @/components/ui/grid import'
);
pass(
  'imports Typography or Text',
  /@\/components\/ui\/typography/.test(src),
  /@\/components\/ui\/typography/.test(src)
    ? 'Found typography import'
    : 'Missing @/components/ui/typography import'
);
pass(
  'no div flex layout shell',
  !/<div[^>]*className=['"][^'"]*\bflex\b/.test(src),
  /<div[^>]*className=['"][^'"]*\bflex\b/.test(src)
    ? 'Found div with flex in className'
    : 'No div flex shell detected'
);
pass(
  'no div grid layout shell',
  !/<div[^>]*className=['"][^'"]*\bgrid\b/.test(src),
  /<div[^>]*className=['"][^'"]*\bgrid\b/.test(src)
    ? 'Found div with grid in className'
    : 'No div grid shell detected'
);
pass(
  'no styled h3 section header',
  !/<h3[^>]*className=['"][^'"]*text-/.test(src),
  /<h3[^>]*className=['"][^'"]*text-/.test(src)
    ? 'Found h3 with text-* classes'
    : 'No raw styled h3'
);
pass(
  'uses Typography or Text component',
  /<Typography\.|<Text\b/.test(src),
  /<Typography\.|<Text\b/.test(src) ? 'Found Typography/Text usage' : 'No Typography/Text in JSX'
);

const failed = results.filter((r) => !r.passed);
for (const r of results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'}: ${r.name} — ${r.evidence}`);
}

const summary = {
  passed: results.filter((r) => r.passed).length,
  failed: failed.length,
  total: results.length,
  pass_rate: results.filter((r) => r.passed).length / results.length
};

console.log(JSON.stringify({ summary, assertion_results: results }, null, 2));
process.exit(failed.length ? 1 : 0);
