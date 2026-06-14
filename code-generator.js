import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { log, error } = console;

const removeDir = (dirPath) => {
  if (fs.existsSync(dirPath)) {
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
  } else {
    log('Directory path not found.');
  }
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

const codeGenerator = async (baseURL, destination) => {
  const orvalConfigPath = path.resolve(__dirname, `${destination}/services/orval.config.js`);
  const generatedServicesPath = path.resolve(__dirname, `${destination}/services`);
  const customInstancePath = path.resolve(__dirname, `${destination}/lib/api/api-client.ts`);

  try {
    removeDir(generatedServicesPath);
    const response = await axios.get(`${baseURL}/openapi`);
    log('OpenAPI spec fetched:', response.statusText);
    const spec = response.data;

    // Compute relative path from generated services dir to the custom instance
    const relativeMutatorPath = path.relative(generatedServicesPath, customInstancePath);
    // Convert Windows backslashes to forward slashes and ensure it starts with './' or '../'
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
                path: mutatorImportPath, // ← correct relative path
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
  } catch (err) {
    error('Error generating code:', err);
  }
};

const destination = './src';

function resolveOpenApiBaseUrl() {
  const explicit = process.env['OPENAPI_BASE_URL']?.replace(/\/$/, '');
  if (explicit) return explicit;

  const apiUrl = process.env['NEXT_PUBLIC_API_URL']?.replace(/\/$/, '');
  if (apiUrl) {
    return apiUrl.replace(/\/api\/v1$/i, '');
  }

  return 'http://localhost:8080';
}

const openApiBaseUrl = resolveOpenApiBaseUrl();
log(`Using OpenAPI base URL: ${openApiBaseUrl}`);
codeGenerator(openApiBaseUrl, destination);
