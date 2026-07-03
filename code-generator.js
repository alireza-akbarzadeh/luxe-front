import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swagger2openapi from 'swagger2openapi';

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

const COMPONENT_REF_PREFIX = '#/components/';

/** Collect component refs (schemas, requestBodies, responses, parameters, …). */
const extractComponentReferences = (obj, components, refs = new Set()) => {
  const findRefs = (value) => {
    if (typeof value !== 'object' || value === null) return;

    if (typeof value.$ref === 'string' && value.$ref.startsWith(COMPONENT_REF_PREFIX)) {
      const refPath = value.$ref.slice(COMPONENT_REF_PREFIX.length);
      const [componentType, ...nameParts] = refPath.split('/');
      const name = nameParts.join('/');
      const key = `${componentType}:${name}`;

      if (!refs.has(key)) {
        refs.add(key);
        const bucket = components?.[componentType];
        if (bucket?.[name]) findRefs(bucket[name]);
      }
    }

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) findRefs(value[key]);
    }
  };

  findRefs(obj);
  return refs;
};

const filterComponents = (components, refs) => {
  const filtered = {};
  refs.forEach((key) => {
    const [componentType, name] = key.split(':');
    if (!filtered[componentType]) filtered[componentType] = {};
    if (components?.[componentType]?.[name]) {
      filtered[componentType][name] = components[componentType][name];
    }
  });
  return filtered;
};

const convertSwagger2ToOpenApi3 = (swagger2) =>
  new Promise((resolve, reject) => {
    swagger2openapi.convert(swagger2, {}, (err, options) => {
      if (err) reject(err);
      else resolve(options.openapi);
    });
  });

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

async function fetchOpenApiFromUrl(baseURL) {
  try {
    const response = await axios.get(`${baseURL}/openapi`, { timeout: 30_000 });
    log('OpenAPI spec fetched from /openapi:', response.statusText);
    return response.data;
  } catch (openApiErr) {
    log(`GET /openapi failed (${openApiErr.message}); trying /swagger/doc.json`);
    const swaggerResponse = await axios.get(`${baseURL}/swagger/doc.json`, { timeout: 30_000 });
    log('Swagger 2 spec fetched from /swagger/doc.json:', swaggerResponse.statusText);
    return convertSwagger2ToOpenApi3(swaggerResponse.data);
  }
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
    return await fetchOpenApiFromUrl(baseURL);
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
      const refs = extractComponentReferences(methodDetails, components);
      const filteredComponents = filterComponents(components || {}, refs);

      const singleEndpointData = {
        openapi: spec.openapi,
        info: spec.info,
        servers: spec.servers,
        paths: { [endpointPath]: { [method]: methodDetails } },
        components: filteredComponents
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
