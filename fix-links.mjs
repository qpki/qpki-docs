#!/usr/bin/env node
// Post-build script to fix links in generated HTML files

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const DIST = './dist';

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(path);
    } else if (entry.name.endsWith('.html')) {
      yield path;
    }
  }
}

async function fixLinks() {
  let fixed = 0;

  for await (const file of walkDir(DIST)) {
    let content = await readFile(file, 'utf-8');
    let modified = false;

    // Fix /pki/docs/... → /qpki/...
    const pki = content.replace(/href="\/pki\/docs\//g, 'href="/qpki/');
    if (pki !== content) {
      content = pki;
      modified = true;
    }

    // Fix any remaining docs/... links in qpki pages
    if (file.includes('/qpki/')) {
      const docs = content.replace(/href="\/docs\//g, 'href="/qpki/');
      if (docs !== content) {
        content = docs;
        modified = true;
      }
    }

    if (modified) {
      await writeFile(file, content);
      fixed++;
    }
  }

  console.log(`Fixed links in ${fixed} files`);
}

fixLinks().catch(console.error);
