const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "public");

const allowedTopLevelFiles = [
  "index.html",
  "README.md",
  "LICENSE",
  "vercel.json"
];

const allowedDirectories = [
  "data",
  "docs",
  "reports",
  "submissions"
];

const forbiddenExtensions = new Set([
  ".hpgl",
  ".hpgl2",
  ".hpg",
  ".hp",
  ".plt",
  ".plx",
  ".astm",
  ".dxf",
  ".iso",
  ".aama",
  ".vnf"
]);

function removeDirectory(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function ensureDirectory(target) {
  fs.mkdirSync(target, { recursive: true });
}

function assertSafeFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (forbiddenExtensions.has(extension) || filePath.toLowerCase().endsWith(".vnf.json")) {
    throw new Error(`Forbidden public artifact detected: ${filePath}`);
  }
}

function copyFile(source, destination) {
  assertSafeFile(source);
  ensureDirectory(path.dirname(destination));
  fs.copyFileSync(source, destination);
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      continue;
    }

    if (entry.isFile()) {
      copyFile(sourcePath, destinationPath);
    }
  }
}

removeDirectory(output);
ensureDirectory(output);

for (const file of allowedTopLevelFiles) {
  copyFile(path.join(root, file), path.join(output, file));
}

for (const directory of allowedDirectories) {
  copyDirectory(path.join(root, directory), path.join(output, directory));
}

console.log(`Static public export written to ${output}`);
