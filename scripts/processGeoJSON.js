// scripts/processGeoJSON.js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the GeoJSON file
const geojsonData = readFileSync('custom.geo.json', 'utf8');
const data = JSON.parse(geojsonData);

// Create the data directory if it doesn't exist
const dataDir = join(dirname(__dirname), 'src', 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Write the processed data
writeFileSync(join(dataDir, 'custom.geo.json'), JSON.stringify(data, null, 2));

console.log('GeoJSON file has been processed and saved to src/data/custom.geo.json');