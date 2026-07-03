import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { log, error } = console;

const removeDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  const files = fs.readdirSync(dirPath);
  if (files.length <= 1) return;
  const directories = files.filter((file) => file !== '.gitkeep');
  directories.forEach((filename) => {
    const filePath = path.join(dirPath, filename);
    if (fs.statSync(filePath).isDirectory()) {
      removeDir(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });
  fs.rmdirSync(dirPath, { recursive: true, force: true });
};

const extractSchemaReferences = (obj, schemas, refs = new Set()) => {
  const findRefs = (value) => {
    if (typeof value !== 'object' || value === null) return;
    if (value.$ref) {
      const refName = value.$ref.replace('#/components/schemas/', '');
      if (!refs.has(refName)) {
        refs.add(refName);
        if (schemas[refName]) findRefs(schemas[refName]);
      }
    }
    for (const key in value) {
      if (value.hasOwnProperty(key)) findRefs(value[key]);
    }
  };
  findRefs(obj);
  return refs;
};

const filterSchemas = (schemas, refs) => {
  const filtered = {};
  refs.forEach((ref) => {
    if (schemas[ref]) filtered[ref] = schemas[ref];
  });
  return filtered;
};

const fsPromises = fs.promises;

function resolveOpenApiBaseUrl() {
  const explicit = process.env['OPENAPI_BASE_URL']?.replace(/\/$/, '');
  if (explicit) return explicit;

  const apiUrl = process.env['NEXT_PUBLIC_API_URL']?.replace(/\/$/, '');
  if (apiUrl) {
    return apiUrl.replace(/\/api\/v1$/i, '');
  }

  return 'http://localhost:8080';
}

async function loadOpenApiSpec(baseURL) {
  const specFileEnv = process.env['OPENAPI_SPEC_FILE'];
  const bundledSpec = path.resolve(__dirname, 'openapi3.json');

  if (specFileEnv) {
    const specFile = path.resolve(process.cwd(), specFileEnv);
    if (!fs.existsSync(specFile)) {
      throw new Error(`OPENAPI_SPEC_FILE not found: ${specFile}`);
    }
    log(`Loading OpenAPI spec from file: ${specFile}`);
    return JSON.parse(fs.readFileSync(specFile, 'utf8'));
  }

  try {
    const response = await axios.get(`${baseURL}/openapi`, { timeout: 30_000 });
    log('OpenAPI spec fetched:', response.statusText);
    return response.data;
  } catch (fetchErr) {
    if (fs.existsSync(bundledSpec)) {
      log(`Fetch failed (${fetchErr.message}); using bundled ${bundledSpec}`);
      return JSON.parse(fs.readFileSync(bundledSpec, 'utf8'));
    }
    throw fetchErr;
  }
}

const codeGenerator = async (baseURL, destination) => {
  const orvalConfigPath = path.resolve(__dirname, `${destination}/services/orval.config.js`);
  const generatedServicesPath = path.resolve(__dirname, `${destination}/services`);
  const customInstancePath = path.resolve(__dirname, `${destination}/lib/api/api-client.ts`);

  const spec = await loadOpenApiSpec(baseURL);

  removeDir(generatedServicesPath);

  const relativeMutatorPath = path.relative(generatedServicesPath, customInstancePath);
  const normalizedMutatorPath = relativeMutatorPath.split(path.sep).join('/');
  const mutatorImportPath = normalizedMutatorPath.startsWith('.')
    ? normalizedMutatorPath
    : `./${normalizedMutatorPath}`;

  const configs = [];
  const outputPath = `${generatedServicesPath}/`;
  fs.mkdirSync(outputPath, { recursive: true });

  const { paths, components } = spec;
  for (const [endpointPath, methods] of Object.entries(paths)) {
    for (const [method, methodDetails] of Object.entries(methods)) {
      const refs = extractSchemaReferences(methodDetails, components?.schemas || {});
      const filteredSchemas = filterSchemas(components?.schemas || {}, refs);

      const singleEndpointData = {
        openapi: spec.openapi,
        info: spec.info,
        servers: spec.servers,
        paths: { [endpointPath]: { [method]: methodDetails } },
        components: { schemas: filteredSchemas }
      };

      const adjustedPath = endpointPath.split('/').join('-');
      const targetFile = `${outputPath}${adjustedPath}-${method}.ts`;

      configs.push({
        output: {
          target: targetFile,
          client: 'react-query',
          httpClient: 'axios',
          mode: 'split',
          prettier: true,
          override: {
            mutator: {
              path: mutatorImportPath,
              name: 'customInstance'
            }
          }
        },
        input: { target: singleEndpointData }
      });
    }
  }

  log(`Generating Orval config with ${configs.length} endpoint configs...`);
  await fsPromises.writeFile(
    orvalConfigPath,
    `module.exports = ${JSON.stringify(configs, null, 2)};`,
    'utf8'
  );
  log(`Orval config written to ${orvalConfigPath}`);
};

const destination = './src';
const openApiBaseUrl = resolveOpenApiBaseUrl();
log(`Using OpenAPI base URL: ${openApiBaseUrl}`);

codeGenerator(openApiBaseUrl, destination).catch((err) => {
  error('Error generating code:', err);
  process.exit(1);
});
