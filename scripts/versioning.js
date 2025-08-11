const fs = require('fs');
const path = require('path');

// Paths
const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const publishDir = path.join(rootDir, 'public');
const versionJsonPath = path.join(publishDir, 'version.json');

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Ensure public directory exists
if (!fs.existsSync(publishDir)) {
  fs.mkdirSync(publishDir, { recursive: true });
}

// Write version to version.json
const versionData = { version };
fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2), 'utf8');

console.log(`Version ${version} written to ${versionJsonPath}`);
