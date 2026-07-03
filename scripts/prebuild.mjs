#!/usr/bin/env node
/**
 * Vercel/CI prebuild: regenerate Orval clients when possible.
 * Uses committed openapi3.json when no live API is reachable (VERCEL/CI).
 */
import { spawnSync } from 'node:child_process';

if (process.env['SKIP_API_GEN'] === '1') {
  console.log('SKIP_API_GEN=1 — skipping Orval regeneration');
  process.exit(0);
}

const onCi =
  process.env['CI'] === 'true' || process.env['CI'] === '1' || Boolean(process.env['VERCEL']);
if (onCi && !process.env['OPENAPI_BASE_URL']) {
  process.env['OPENAPI_SPEC_FILE'] ??= 'openapi3.json';
  console.log(`CI/Vercel build — using OpenAPI spec file: ${process.env['OPENAPI_SPEC_FILE']}`);
}

const result = spawnSync('pnpm', ['api:gen'], {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});
process.exit(result.status ?? 1);
