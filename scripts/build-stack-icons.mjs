import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const iconDir = resolve(root, "node_modules/simple-icons/icons");
const names = {
  angular: "angular",
  react: "react",
  node: "nodedotjs",
  ionic: "ionic",
  capacitor: "capacitor",
  android: "android",
  ios: "apple",
  api: "swagger",
  devops: "devdotto",
  jenkins: "jenkins",
  ai: "huggingface",
  javascript: "javascript",
  typescript: "typescript",
  bootstrap: "bootstrap",
  tailwind: "tailwindcss",
  gradle: "gradle",
  play: "googleplay",
  appstore: "appstore",
  xcode: "swift",
  vscode: "vscodium",
};

const entries = Object.entries(names).map(([key, filename]) => {
  const svg = readFileSync(resolve(iconDir, `${filename}.svg`), "utf8")
    .replace(/\r?\n/g, " ")
    .replace(/`/g, "\\`");
  return `  ${key}: \`${svg}\`,`;
});

const output = `// Generated from simple-icons SVG files. Keep this file self-contained.\nexport const stackLogoSvg: Record<string, string> = {\n${entries.join("\n")}\n};\n`;

mkdirSync(resolve(root, "src/lib"), { recursive: true });
writeFileSync(resolve(root, "src/lib/stackLogos.ts"), output);
console.log("Generated src/lib/stackLogos.ts with", entries.length, "official SVG logos");
