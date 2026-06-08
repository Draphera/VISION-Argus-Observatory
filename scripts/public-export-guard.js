const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const scanRoots = ["data", "docs", "reports", "submissions", "index.html", "contact.html", "README.md", "LICENSE", "vercel.json"]
  .map((entry) => path.join(root, entry));

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
  ".vnf",
  ".zip",
  ".rar",
  ".7z"
]);

const textExtensions = new Set([
  ".html",
  ".md",
  ".json",
  ".csv",
  ".txt",
  ".yml",
  ".yaml",
  ".js",
  ".css"
]);

const forbiddenContentPatterns = [
  { name: "windows_local_path", pattern: /[A-Za-z]:\\(?:Users|VISION|hpgl|temp|tmp|Server)\\/ },
  { name: "unc_path", pattern: /\\\\[^\\\s]+\\[^\\\s]+/ },
  { name: "file_uri", pattern: /file:\/\/\//i },
  { name: "vnf_artifact_reference", pattern: /\b[a-z0-9._-]+\.vnf(?:\.json)?\b/i },
  { name: "raw_hpgl_reference", pattern: /\b[a-z0-9._-]+\.(?:hpgl2?|hpg|hp|plt|plx|astm|dxf|iso|aama)\b/i },
  { name: "hpgl_coordinate_stream", pattern: /\b(?:PU|PD|PA|PR)-?\d+,-?\d+(?:,-?\d+,-?\d+){2,}/i }
];

const findings = [];

function walk(target) {
  if (!fs.existsSync(target)) {
    return;
  }

  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
      if (entry.name === "public" || entry.name === "node_modules" || entry.name === ".git" || entry.name === ".vercel") {
        continue;
      }

      walk(path.join(target, entry.name));
    }
    return;
  }

  if (!stat.isFile()) {
    return;
  }

  inspectFile(target);
}

function inspectFile(filePath) {
  const relative = path.relative(root, filePath).replace(/\\/g, "/");
  const extension = path.extname(filePath).toLowerCase();

  if (forbiddenExtensions.has(extension) || filePath.toLowerCase().endsWith(".vnf.json")) {
    findings.push({ file: relative, reason: "forbidden_extension" });
    return;
  }

  if (!textExtensions.has(extension)) {
    return;
  }

  const text = fs.readFileSync(filePath, "utf8");
  for (const item of forbiddenContentPatterns) {
    if (item.pattern.test(text)) {
      findings.push({ file: relative, reason: item.name });
    }
  }
}

for (const target of scanRoots) {
  walk(target);
}

if (findings.length > 0) {
  console.error("VISION ARGUS PUBLIC EXPORT GUARD FAILED");
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.reason}`);
  }
  process.exit(1);
}

console.log("VISION ARGUS PUBLIC EXPORT GUARD PASSED");
