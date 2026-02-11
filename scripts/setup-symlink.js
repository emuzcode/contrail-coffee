const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const source = '/vercel/share/v0-project';
const target = '/vercel/share/v0-next-shadcn';

// List files to copy
const filesToCopy = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'app/globals.css',
  'app/layout.tsx',
  'app/page.tsx',
  'lib/utils.ts',
];

for (const file of filesToCopy) {
  const src = path.join(source, file);
  const dst = path.join(target, file);
  
  if (!fs.existsSync(src)) {
    console.log(`SKIP: ${src} does not exist`);
    continue;
  }
  
  // Ensure target directory exists
  const dstDir = path.dirname(dst);
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
    console.log(`MKDIR: ${dstDir}`);
  }
  
  // Copy file
  fs.copyFileSync(src, dst);
  console.log(`COPIED: ${src} -> ${dst}`);
}

// Verify
console.log('\n--- Verification ---');
for (const file of filesToCopy) {
  const dst = path.join(target, file);
  console.log(`${fs.existsSync(dst) ? 'OK' : 'MISSING'}: ${dst}`);
}
