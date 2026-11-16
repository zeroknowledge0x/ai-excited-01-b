import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const image = join(here, 'entry.png');

const MAX_BYTES = 1048576;

let info;
try {
  info = statSync(image);
} catch {
  console.error('missing entry.png beside main.ts at ' + image);
  process.exit(1);
}

if (!info.isFile()) {
  console.error('entry path is not a regular file');
  process.exit(1);
}

if (info.size > MAX_BYTES) {
  console.error('entry image is too big for the competition cap');
  process.exit(1);
}

const bytes = readFileSync(image);
const head = bytes.subarray(0, 2).toString('hex');

console.log('entry image bytes ' + bytes.length);
console.log('first two bytes ' + head);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });

const target = join(outDir, 'entry.png');
copyFileSync(image, target);

console.log('entry.png ' + bytes.length + ' bytes, starts with ' + head + ', copied to ' + target);
