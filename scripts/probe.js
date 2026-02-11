const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Try to find where the v0-project files actually live on disk
console.log("=== Finding v0-project files ===");
try {
  const result = execSync('find / -name "v0-project" -maxdepth 4 2>/dev/null || true', { encoding: 'utf8', timeout: 5000 });
  console.log("find v0-project:", result || "(nothing found)");
} catch(e) {
  console.log("find error:", e.message);
}

try {
  const result = execSync('find / -name "v0-next-shadcn" -maxdepth 4 2>/dev/null || true', { encoding: 'utf8', timeout: 5000 });
  console.log("find v0-next-shadcn:", result || "(nothing found)");
} catch(e) {
  console.log("find error:", e.message);
}

// Check mount points
console.log("\n=== Mount points ===");
try {
  const result = execSync('mount 2>/dev/null || cat /proc/mounts 2>/dev/null || echo "cannot read mounts"', { encoding: 'utf8', timeout: 5000 });
  console.log(result);
} catch(e) {
  console.log("mount error:", e.message);
}

// Check if there's a symlink or bind mount 
console.log("\n=== Check /vercel via ls ===");
try {
  const result = execSync('ls -la /vercel 2>/dev/null || echo "no /vercel"', { encoding: 'utf8' });
  console.log(result);
} catch(e) {
  console.log("ls error:", e.message);
}

console.log("\n=== Check /vercel/share via ls ===");
try {
  const result = execSync('ls -la /vercel/share 2>/dev/null || echo "no /vercel/share"', { encoding: 'utf8' });
  console.log(result);
} catch(e) {
  console.log("ls error:", e.message);
}

// Try readlink on v0-project
console.log("\n=== Readlink ===");
try {
  const result = execSync('readlink -f /vercel/share/v0-project 2>/dev/null || echo "cannot readlink"', { encoding: 'utf8' });
  console.log("v0-project realpath:", result);
} catch(e) {
  console.log("readlink error:", e.message);
}

// Check environment variables for hints
console.log("\n=== Env vars with path hints ===");
for (const [k, v] of Object.entries(process.env)) {
  if (v && (v.includes('vercel') || v.includes('v0-') || v.includes('share') || v.includes('next') || v.includes('shadcn'))) {
    console.log(`${k}=${v}`);
  }
}

// Try which pnpm / which next
console.log("\n=== Which commands ===");
try {
  console.log("pnpm:", execSync('which pnpm 2>/dev/null || echo "not found"', { encoding: 'utf8' }).trim());
  console.log("next:", execSync('which next 2>/dev/null || echo "not found"', { encoding: 'utf8' }).trim());
  console.log("npx:", execSync('which npx 2>/dev/null || echo "not found"', { encoding: 'utf8' }).trim());
} catch(e) {
  console.log("which error:", e.message);
}
