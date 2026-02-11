import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
console.log("CWD:", cwd);
console.log("Node version:", process.version);

// Check if key files exist
const files = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  'postcss.config.mjs',
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'node_modules/next/package.json',
  'node_modules/react/package.json',
  'node_modules/tailwindcss/package.json',
];

for (const f of files) {
  const full = path.join(cwd, f);
  const exists = fs.existsSync(full);
  console.log(`${exists ? 'OK' : 'MISSING'}: ${f}`);
  if (exists && f.endsWith('package.json') && f !== 'package.json') {
    try {
      const pkg = JSON.parse(fs.readFileSync(full, 'utf-8'));
      console.log(`  version: ${pkg.version}`);
    } catch (e) {
      console.log(`  error reading: ${e.message}`);
    }
  }
}

// Check package.json content
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
  console.log("\npackage.json scripts:", JSON.stringify(pkg.scripts));
  console.log("package.json dependencies:", JSON.stringify(pkg.dependencies));
} catch (e) {
  console.log("Error reading package.json:", e.message);
}

// List app/ directory
try {
  const appDir = path.join(cwd, 'app');
  const appFiles = fs.readdirSync(appDir);
  console.log("\napp/ directory contents:", appFiles);
} catch (e) {
  console.log("Error listing app/:", e.message);
}

// List root directory (first 30)
try {
  const rootFiles = fs.readdirSync(cwd).slice(0, 30);
  console.log("\nRoot directory (first 30):", rootFiles);
} catch (e) {
  console.log("Error listing root:", e.message);
}
