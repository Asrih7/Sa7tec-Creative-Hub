import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist", "public");
const templatePath = path.join(distDir, "index.html");

if (!readFileSync(templatePath, "utf8")) {
  throw new Error("Expected dist/public/index.html to exist. Run the Vite build first.");
}

const template = readFileSync(templatePath, "utf8");
const routes = [
  {
    route: "/contact",
    title: "Contact SA7TEC | Digital Product Studio",
    description: "Start a project with SA7TEC. Share your brief and we will turn it into a beautifully crafted product.",
    canonical: "https://sa7tec.com/contact",
  },
  {
    route: "/404",
    title: "Page Not Found | SA7TEC",
    description: "The page you are looking for is not available. Explore SA7TEC’s studio homepage and contact page instead.",
    canonical: "https://sa7tec.com/404",
  },
];

for (const { route, title, description, canonical } of routes) {
  const outputDir = path.join(distDir, route.replace(/^\//, ""));
  mkdirSync(outputDir, { recursive: true });
  const html = template
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${description}"`)
    .replace(/<link rel="canonical" href="[^"]*"/i, `<link rel="canonical" href="${canonical}"`)
    .replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${canonical}"`)
    .replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${title}"`)
    .replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${description}"`);
  writeFileSync(path.join(outputDir, "index.html"), html);
}

writeFileSync(path.join(distDir, "404.html"), template.replace(/<title>.*?<\/title>/s, `<title>Page Not Found | SA7TEC</title>`));
console.log("Prerendered route entry points for /contact and /404.");
