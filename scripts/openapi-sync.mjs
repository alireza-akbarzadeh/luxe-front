#!/usr/bin/env node
/**
 * Refresh committed openapi3.json from a live Luxe API.
 * Render serves Swagger 2 at /swagger/doc.json (Swagger UI: /swagger/index.html).
 * Local dev: make swagger && make run → http://localhost:8080/swagger/doc.json
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import axios from 'axios';
import swagger2openapi from 'swagger2openapi';

function resolveBaseUrl() {
  const explicit = process.env['OPENAPI_BASE_URL']?.replace(/\/$/, '');
  if (explicit) return explicit;

  const apiUrl = process.env['NEXT_PUBLIC_API_URL']?.replace(/\/$/, '');
  if (apiUrl) return apiUrl.replace(/\/api\/v1$/i, '');

  return 'http://localhost:8080';
}

const convertSwagger2ToOpenApi3 = (swagger2) =>
  new Promise((resolvePromise, reject) => {
    swagger2openapi.convert(swagger2, {}, (err, options) => {
      if (err) reject(err);
      else resolvePromise(options.openapi);
    });
  });

const baseUrl = resolveBaseUrl();
const outPath = resolve(process.cwd(), 'openapi3.json');

console.log(`Fetching Swagger 2 from ${baseUrl}/swagger/doc.json`);

const { data: swagger2 } = await axios.get(`${baseUrl}/swagger/doc.json`, { timeout: 60_000 });
const openapi3 = await convertSwagger2ToOpenApi3(swagger2);

writeFileSync(outPath, JSON.stringify(openapi3));
console.log(
  `Wrote ${outPath} (${(Buffer.byteLength(JSON.stringify(openapi3)) / 1024 / 1024).toFixed(2)} MB)`
);
console.log('Next: pnpm api:gen && pnpm check && git add openapi3.json');
