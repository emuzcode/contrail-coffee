const fs = require('fs');
const path = require('path');

// Check what's at /home/user
console.log("=== /home/user contents ===");
try {
  const items = fs.readdirSync('/home/user');
  items.forEach(item => {
    const stat = fs.statSync(path.join('/home/user', item));
    console.log(`  ${item} (${stat.isDirectory() ? 'DIR' : 'FILE'})`);
  });
} catch(e) { console.log("Error:", e.message); }

// Read /home/user/package.json
console.log("\n=== /home/user/package.json ===");
try {
  const pkg = fs.readFileSync('/home/user/package.json', 'utf8');
  console.log(pkg);
} catch(e) { console.log("Error:", e.message); }

// Check if /home/user/app exists
console.log("\n=== /home/user/app ===");
try {
  const items = fs.readdirSync('/home/user/app');
  console.log("Contents:", items);
} catch(e) { console.log("Not found:", e.message); }

// Check all directories under /vercel
console.log("\n=== /vercel ===");
try {
  const items = fs.readdirSync('/vercel');
  items.forEach(item => {
    const fullPath = path.join('/vercel', item);
    const stat = fs.statSync(fullPath);
    console.log(`  ${item} (${stat.isDirectory() ? 'DIR' : 'FILE'})`);
    if (stat.isDirectory()) {
      try {
        const sub = fs.readdirSync(fullPath);
        sub.forEach(s => console.log(`    ${s}`));
      } catch(e2) {}
    }
  });
} catch(e) { console.log("Not found:", e.message); }

// Try to write to /home/user
console.log("\n=== Write test to /home/user/test.txt ===");
try {
  fs.writeFileSync('/home/user/test.txt', 'hello');
  console.log("SUCCESS - can write to /home/user");
  fs.unlinkSync('/home/user/test.txt');
} catch(e) { console.log("FAILED:", e.message); }

// Try to create /home/user/app directory
console.log("\n=== Mkdir test /home/user/app ===");
try {
  fs.mkdirSync('/home/user/app', { recursive: true });
  console.log("SUCCESS - can create /home/user/app");
  fs.rmdirSync('/home/user/app');
} catch(e) { console.log("FAILED:", e.message); }
