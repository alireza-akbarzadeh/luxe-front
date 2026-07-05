#!/usr/bin/env node
/**
 * Writes public/version.json for client-side update polling.
 * Semver comes from package.json; buildId is git SHA (new on every deploy).
 */
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function resolveBuildId() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8', cwd: root }).trim();
  } catch {
    return 'dev';
  }
}

const payload = {
  version: pkg.version ?? '0.0.0',
  buildId: resolveBuildId(),
  builtAt: new Date().toISOString()
};

const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'version.json'), `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote public/version.json — ${payload.version}@${payload.buildId}`);
