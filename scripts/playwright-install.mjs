#!/usr/bin/env node
/* eslint-disable no-undef */
/**
 * Installs Playwright browsers with fallbacks for regions where cdn.playwright.dev
 * returns 403 (geo-restricted networks).
 *
 * Override mirrors:
 *   PLAYWRIGHT_DOWNLOAD_HOST=https://your-mirror/playwright
 *   PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST=https://your-mirror/chrome-for-testing
 *
 * Skip browser download entirely (use system Chrome via PLAYWRIGHT_USE_SYSTEM_CHROME=1):
 *   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm install
 */
import { spawn } from 'node:child_process';

const SKIP =
  process.env['PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD'] === '1' ||
  process.env['CI'] === 'true' ||
  process.env['CI'] === '1' ||
  Boolean(process.env['VERCEL']);

const MIRROR_PRESETS = [
  {
    label: 'testeng mirror (Iran / restricted networks)',
    env: {
      PLAYWRIGHT_DOWNLOAD_HOST: 'https://mirror.testeng.ir/playwright',
      PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST: 'https://mirror.testeng.ir/playwright'
    }
  },
  {
    label: 'npmmirror',
    env: {
      PLAYWRIGHT_DOWNLOAD_HOST: 'https://cdn.npmmirror.com/binaries/playwright',
      PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST: 'https://cdn.npmmirror.com/binaries/chrome-for-testing'
    }
  },
  {
    label: 'default CDN',
    env: {}
  }
];

function runPlaywrightInstall(extraEnv) {
  const env = {
    ...process.env,
    ...extraEnv
  };

  if (process.env['PLAYWRIGHT_DOWNLOAD_HOST']) {
    env['PLAYWRIGHT_DOWNLOAD_HOST'] = process.env['PLAYWRIGHT_DOWNLOAD_HOST'];
  }
  if (process.env['PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST']) {
    env['PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST'] = process.env['PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST'];
  }

  return new Promise((resolve) => {
    const child = spawn('pnpm', ['exec', 'playwright', 'install', 'chromium'], {
      stdio: 'inherit',
      env,
      shell: process.platform === 'win32'
    });

    child.on('close', (code) => resolve(code === 0));
  });
}

async function main() {
  if (SKIP) {
    const reason = process.env['VERCEL']
      ? 'Vercel build'
      : process.env['CI']
        ? 'CI'
        : 'PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1';
    console.log(
      `⏭️  Skipping Playwright browser download (${reason}).\n` +
        '   Run pnpm run test:install locally before E2E tests.'
    );
    return;
  }

  for (const preset of MIRROR_PRESETS) {
    console.log(`\n🎭 Playwright install (${preset.label})…`);
    const ok = await runPlaywrightInstall(preset.env);
    if (ok) {
      console.log(`\n✅ Playwright browsers installed (${preset.label}).`);
      return;
    }
    console.warn(`⚠️  Install failed (${preset.label}), trying next mirror…`);
  }

  console.error(`
❌ Could not download Playwright browsers from any mirror.

Recommended (no CDN download — uses Google Chrome already on your Mac):

  echo 'PLAYWRIGHT_USE_SYSTEM_CHROME=1' >> .env.test.local
  echo 'PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1' >> .env.test.local
  pnpm install

Other options:
  1. VPN, then:  pnpm run test:install
  2. Custom mirror:
       export PLAYWRIGHT_DOWNLOAD_HOST=https://your-mirror/playwright
       export PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST=https://your-mirror/chrome-for-testing
       pnpm run test:install
`);

  // Do not fail `pnpm install` — dev can still run the app without E2E browsers.
  process.exitCode = 0;
}

main();
