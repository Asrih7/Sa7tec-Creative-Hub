#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if using pnpm
const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.includes('pnpm/')) {
  console.error('Use pnpm instead');
  process.exit(1);
}

// Remove package-lock.json and yarn.lock from root
const rootDir = path.resolve(__dirname, '..');
const filesToRemove = ['package-lock.json', 'yarn.lock'];

filesToRemove.forEach(file => {
  const filePath = path.join(rootDir, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed ${file}`);
    }
  } catch (err) {
    console.warn(`Could not remove ${file}:`, err.message);
  }
});
