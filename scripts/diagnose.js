const fs = require('fs');
const path = require('path');

console.log("CWD:", process.cwd());
console.log("");

// Check various potential paths
const dirs = [
  '/vercel/share',
  '/vercel/share/v0-project',
  '/vercel/share/v0-next-shadcn',
  process.cwd(),
];

for (const d of dirs) {
  try {
    const stat = fs.statSync(d);
    const isLink = fs.lstatSync(d).isSymbolicLink();
    if (isLink) {
      const target = fs.readlinkSync(d);
      console.log(`${d} -> SYMLINK to ${target}`);
    } else {
      console.log(`${d} -> ${stat.isDirectory() ? 'DIR' : 'FILE'}`);
    }
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(d);
      console.log(`  Contents (${entries.length}):`, entries.slice(0, 30).join(', '));
    }
  } catch (e) {
    console.log(`${d} -> NOT FOUND (${e.code})`);
  }
  console.log("");
}

// Check if v0-project files exist with absolute paths
const checkFiles = [
  '/vercel/share/v0-project/package.json',
  '/vercel/share/v0-project/app/page.tsx',
  '/vercel/share/v0-project/app/layout.tsx',
];
console.log("--- File existence check ---");
for (const f of checkFiles) {
  try {
    const content = fs.readFileSync(f, 'utf8');
    console.log(`${f} -> EXISTS (${content.length} bytes)`);
  } catch (e) {
    console.log(`${f} -> ${e.code}`);
  }
}
