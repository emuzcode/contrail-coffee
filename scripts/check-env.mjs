import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log("=== Environment Check ===");
console.log("Node version:", process.version);
console.log("CWD:", process.cwd());

// Check if node_modules exists
console.log("\nnode_modules exists:", existsSync("node_modules"));
console.log("node_modules/next exists:", existsSync("node_modules/next"));
console.log("node_modules/react exists:", existsSync("node_modules/react"));
console.log("node_modules/tailwindcss exists:", existsSync("node_modules/tailwindcss"));

// Check if app directory exists
console.log("\napp/ exists:", existsSync("app"));
console.log("app/layout.tsx exists:", existsSync("app/layout.tsx"));
console.log("app/page.tsx exists:", existsSync("app/page.tsx"));
console.log("app/globals.css exists:", existsSync("app/globals.css"));

// Try to check next version
try {
  const nextVersion = execSync("npx next --version 2>&1").toString().trim();
  console.log("\nNext.js version:", nextVersion);
} catch (e) {
  console.log("\nFailed to get Next.js version:", e.message);
}

// Check if port 3000 is in use
try {
  const portCheck = execSync("lsof -i :3000 2>&1 || echo 'port 3000 is free'").toString().trim();
  console.log("\nPort 3000 status:", portCheck);
} catch (e) {
  console.log("\nPort check:", e.message);
}
