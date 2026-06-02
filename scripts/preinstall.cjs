#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Remove package-lock.json and yarn.lock from root
// This ensures consistency when using pnpm
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

console.log('Preinstall cleanup complete');
