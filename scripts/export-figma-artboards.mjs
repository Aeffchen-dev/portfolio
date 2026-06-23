/**
 * Exports artboards from the first 4 pages of a Figma file as JPGs.
 * Artboards are numbered left-to-right, top-to-bottom per page.
 *
 * Usage:
 *   FIGMA_TOKEN=<your-personal-access-token> node scripts/export-figma-artboards.mjs
 *
 * Output files are saved to ./figma-exports/
 * Naming: {page-name}_{number}.jpg  (e.g. "Home_1.jpg", "Home_2.jpg")
 *
 * Generate a Personal Access Token at:
 *   https://www.figma.com/settings → Personal access tokens
 */

import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';

const FILE_KEY = '8zflEnf7KnkROsBYO4RUxt';
const OUTPUT_DIR = './figma-exports';
const SCALE = 2; // 2x resolution for crisp JPGs

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error('Error: FIGMA_TOKEN environment variable is required.');
  console.error('  FIGMA_TOKEN=<your-token> node scripts/export-figma-artboards.mjs');
  process.exit(1);
}

const headers = { 'X-Figma-Token': token };

async function figmaGet(path) {
  const res = await fetch(`https://api.figma.com/v1${path}`, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
}

/**
 * Sort frames left-to-right, top-to-bottom.
 * Groups frames into rows using a y-tolerance of 40% of the median height,
 * then sorts each row by x.
 */
function sortArtboards(frames) {
  if (frames.length === 0) return [];

  const medianHeight = [...frames]
    .sort((a, b) => a.absoluteBoundingBox.height - b.absoluteBoundingBox.height)
    [Math.floor(frames.length / 2)].absoluteBoundingBox.height;

  const rowTolerance = medianHeight * 0.4;

  const sorted = [...frames].sort(
    (a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y
  );

  const rows = [];
  for (const frame of sorted) {
    const fy = frame.absoluteBoundingBox.y;
    const lastRow = rows[rows.length - 1];
    if (lastRow && Math.abs(fy - lastRow[0].absoluteBoundingBox.y) <= rowTolerance) {
      lastRow.push(frame);
    } else {
      rows.push([frame]);
    }
  }

  return rows
    .map(row => row.sort((a, b) => a.absoluteBoundingBox.x - b.absoluteBoundingBox.x))
    .flat();
}

function slugify(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_');
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  await pipeline(res.body, createWriteStream(destPath));
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Fetching file structure for ${FILE_KEY}…`);
  const file = await figmaGet(`/files/${FILE_KEY}?depth=2`);

  const pages = file.document.children.slice(0, 4);
  console.log(`Found ${pages.length} page(s): ${pages.map(p => p.name).join(', ')}\n`);

  const exportBatch = [];

  for (const page of pages) {
    const frames = (page.children ?? []).filter(n => n.type === 'FRAME');
    const sorted = sortArtboards(frames);

    console.log(`Page "${page.name}": ${sorted.length} artboard(s)`);
    sorted.forEach((f, i) => {
      const num = i + 1;
      const fileName = `${slugify(page.name)}_${num}.jpg`;
      console.log(`  ${num}. ${f.name}  →  ${fileName}`);
      exportBatch.push({ id: f.id, pageName: page.name, num, fileName });
    });
  }

  if (exportBatch.length === 0) {
    console.log('No artboards found.');
    return;
  }

  console.log(`\nRequesting image exports from Figma API…`);
  const ids = exportBatch.map(e => e.id).join(',');
  const imgData = await figmaGet(
    `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=jpg&scale=${SCALE}`
  );

  if (imgData.err) throw new Error(`Figma export error: ${imgData.err}`);

  console.log(`Downloading ${exportBatch.length} image(s)…\n`);

  for (const entry of exportBatch) {
    const url = imgData.images[entry.id];
    if (!url) {
      console.warn(`  WARNING: No image URL returned for "${entry.fileName}" (id: ${entry.id})`);
      continue;
    }
    const dest = path.join(OUTPUT_DIR, entry.fileName);
    process.stdout.write(`  Saving ${entry.fileName}… `);
    await downloadImage(url, dest);
    console.log('done');
  }

  console.log(`\nAll images saved to ${OUTPUT_DIR}/`);
}

main().catch(err => {
  console.error('\nFailed:', err.message);
  process.exit(1);
});
