#!/usr/bin/env node
/**
 * Prebuild: regenerate Orval clients before `next build`.
 * Vercel/CI always uses committed openapi3.json (live Render API is unreliable at build time).
 * Local: live API when reachable, otherwise openapi3.json fallback.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

import axios from 'axios';

const BUNDLED_SPEC = 'openapi3.json';

const REQUIRED_CLIENTS = [
  'src/services/orval.config.js',
  'src/services/-cart-get.ts',
  'src/services/-cart-items-post.ts'
];

function resolveOpenApiBaseUrl() {
  const explicit = process.env['OPENAPI_BASE_URL']?.replace(/\/$/, '');
  if (explicit) return explicit;

  const apiUrl = process.env['NEXT_PUBLIC_API_URL']?.replace(/\/$/, '');
  if (apiUrl) return apiUrl.replace(/\/api\/v1$/i, '');

  return 'http://localhost:8080';
}

async function probeLiveApi(baseUrl) {
  try {
    await axios.get(`${baseUrl}/openapi`, { timeout: 8_000 });
    return true;
  } catch {
    try {
      await axios.get(`${baseUrl}/swagger/doc.json`, { timeout: 8_000 });
      return true;
    } catch {
      return false;
    }
  }
}

async function resolveApiGenEnv() {
  const env = { ...process.env };

  if (env['SKIP_API_GEN'] === '1') {
    return { skip: true, env };
  }

  if (env['OPENAPI_SPEC_FILE']) {
    console.log(`Using OPENAPI_SPEC_FILE=${env['OPENAPI_SPEC_FILE']}`);
    return { skip: false, env };
  }

  if (env['OPENAPI_BASE_URL']) {
    console.log(`Using live API (OPENAPI_BASE_URL): ${resolveOpenApiBaseUrl()}`);
    return { skip: false, env };
  }

  const onCi = env['CI'] === 'true' || env['CI'] === '1' || Boolean(env['VERCEL']);

  // Never hit production API during Vercel build — cold starts/timeouts wipe src/services/.
  if (onCi) {
    env['OPENAPI_SPEC_FILE'] = BUNDLED_SPEC;
    console.log(`CI/Vercel build — using bundled ${BUNDLED_SPEC}`);
    return { skip: false, env };
  }

  const baseUrl = resolveOpenApiBaseUrl();
  const live = await probeLiveApi(baseUrl);
  if (live) {
    console.log(`Local build — using live API at ${baseUrl}`);
    return { skip: false, env };
  }

  if (existsSync(BUNDLED_SPEC)) {
    env['OPENAPI_SPEC_FILE'] = BUNDLED_SPEC;
    console.log(`API unreachable at ${baseUrl} — using bundled ${BUNDLED_SPEC}`);
    return { skip: false, env };
  }

  throw new Error(
    `Cannot generate API clients: no API at ${baseUrl} and ${BUNDLED_SPEC} is missing. ` +
      'Run `pnpm openapi:sync` when the backend is up, commit openapi3.json, or start the API locally.'
  );
}

function runApiGen(env) {
  const result = spawnSync('pnpm', ['api:gen'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function verifyGeneratedClients() {
  const missing = REQUIRED_CLIENTS.filter((file) => !existsSync(file));
  if (missing.length > 0) {
    console.error('api:gen did not produce required clients:');
    for (const file of missing) {
      console.error(`  - ${file}`);
    }
    console.error(
      'Fix: OPENAPI_SPEC_FILE=openapi3.json pnpm api:gen (or pnpm openapi:sync && commit openapi3.json)'
    );
    process.exit(1);
  }
}

const { skip, env } = await resolveApiGenEnv();

if (skip) {
  console.log('SKIP_API_GEN=1 — skipping Orval regeneration');
} else {
  if (env['OPENAPI_SPEC_FILE'] && !existsSync(env['OPENAPI_SPEC_FILE'])) {
    console.error(`OPENAPI_SPEC_FILE not found: ${env['OPENAPI_SPEC_FILE']}`);
    process.exit(1);
  }
  runApiGen(env);
}

verifyGeneratedClients();

const versionResult = spawnSync('node', ['scripts/write-version.mjs'], {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});
process.exit(versionResult.status ?? 1);
