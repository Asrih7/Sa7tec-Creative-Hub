import { writeFileSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve(new URL(import.meta.url).pathname.replace(/\/scripts\/generate-sitemap.mjs$/, ''), '..', 'dist', 'public');

const routes = ['/', '/contact', '/games/rubiks-race'];
const site = 'https://sa7tec.com';
const langs = ['en', 'fr', 'ar'];

let urls = '';
for (const route of routes) {
  const loc = `${site}${route === '/' ? '/' : route}`;
  urls += `  <url>\n    <loc>${loc}</loc>\n`;
  for (const lang of langs) {
    const href = `${site}${route === '/' ? '/' : route}`;
    urls += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />\n`;
  }
  urls += `  </url>\n`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}</urlset>`;

writeFileSync(path.join(dist, 'sitemap.xml'), xml, 'utf8');
console.log('Generated sitemap.xml');
