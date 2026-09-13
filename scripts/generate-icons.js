import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);

  // Call drawFn(x, y) returning [r, g, b, a]
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // PNG lines with filter byte 0
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0; // filter None
    buffer.copy(rawData, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const deflated = zlib.deflateSync(rawData);

  // Build PNG chunks
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body), 0);
    return Buffer.concat([len, body, crc]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Icon Drawer: generates a sharp, beautiful isometric city icon
function drawIcon(x, y, w, h, isMaskable = false) {
  // Normalize coords (-1 to 1)
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Background rounded rect or circle
  let cornerRadius = isMaskable ? 0 : 0.42; // for maskable, full bleed
  if (!isMaskable) {
    const absX = Math.abs(nx);
    const absY = Math.abs(ny);
    const rad = 0.82;
    if (absX > rad && absY > rad) {
      const d = Math.sqrt((absX - rad) ** 2 + (absY - rad) ** 2);
      if (d > 0.18) return [0, 0, 0, 0];
    }
  }

  // Dark slate gradient
  const bgInterp = (ny + 1) / 2;
  const rBg = Math.round(15 * (1 - bgInterp) + 9 * bgInterp);
  const gBg = Math.round(23 * (1 - bgInterp) + 13 * bgInterp);
  const bBg = Math.round(42 * (1 - bgInterp) + 22 * bgInterp);

  // Center isometric island:
  // Isometric base diamond centered around (0, 0.3)
  const isoX = nx;
  const isoY = ny - 0.25;

  // Diamond test: |isoX| / 0.75 + |isoY| / 0.35 <= 1
  const inDiamond = Math.abs(isoX) / 0.7 + Math.abs(isoY) / 0.32 <= 1;

  // Buildings in center
  // Center Skyscraper: x between -0.15 and 0.25, y between -0.6 and 0.1
  const inTowerRight = isoX >= 0.05 && isoX <= 0.28 && isoY >= -0.65 && isoY <= 0.05;
  const inTowerLeft = isoX >= -0.28 && isoX < 0.05 && isoY >= -0.45 && isoY <= 0.15;

  // Road stripe: diagonal along bottom
  const roadDist = Math.abs(isoX * 0.5 + isoY - 0.1);
  const isRoad = inDiamond && roadDist < 0.06;

  if (inTowerRight) {
    // Glass blue skyscraper
    const towerGrad = (isoY + 0.65) / 0.7;
    // Window pattern
    const winX = Math.floor((isoX - 0.05) * 50) % 3 === 0;
    const winY = Math.floor((isoY + 0.65) * 40) % 2 === 0;
    if (winX && winY && towerGrad > 0.1) {
      return [186, 230, 253, 255]; // bright window
    }
    return [
      Math.round(2 + 14 * towerGrad),
      Math.round(132 - 40 * towerGrad),
      Math.round(199 - 50 * towerGrad),
      255,
    ];
  }

  if (inTowerLeft) {
    // Emerald green / brick building
    const towerGrad = (isoY + 0.45) / 0.6;
    const winX = Math.floor((isoX + 0.28) * 40) % 3 === 0;
    const winY = Math.floor((isoY + 0.45) * 35) % 2 === 0;
    if (winX && winY && towerGrad > 0.1) {
      return [254, 240, 138, 255]; // warm lit window
    }
    return [
      Math.round(16 + 5 * towerGrad),
      Math.round(185 - 50 * towerGrad),
      Math.round(129 - 40 * towerGrad),
      255,
    ];
  }

  if (isRoad) {
    // Road center dashes
    const dash = Math.floor((isoX + 1) * 30) % 4 < 2;
    if (dash && roadDist < 0.015) {
      return [250, 204, 21, 255]; // yellow dash
    }
    return [51, 65, 85, 255]; // asphalt
  }

  if (inDiamond) {
    // Lush green park grass
    const grassVari = (Math.sin(nx * 40) * Math.cos(ny * 40) + 1) * 0.5;
    return [
      Math.round(34 + 10 * grassVari),
      Math.round(197 - 20 * grassVari),
      Math.round(94 - 15 * grassVari),
      255,
    ];
  }

  // Island 3D base bevel
  const inBase3D = Math.abs(isoX) / 0.7 + Math.abs(isoY - 0.08) / 0.32 <= 1 && isoY > 0;
  if (inBase3D) {
    return [21, 128, 61, 255];
  }

  return [rBg, gBg, bBg, 255];
}

// Generate files
const publicDir = './public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons...');

fs.writeFileSync(`${publicDir}/pwa-192x192.png`, createPNG(192, 192, (x, y, w, h) => drawIcon(x, y, w, h, false)));
console.log('Created pwa-192x192.png');

fs.writeFileSync(`${publicDir}/pwa-512x512.png`, createPNG(512, 512, (x, y, w, h) => drawIcon(x, y, w, h, false)));
console.log('Created pwa-512x512.png');

fs.writeFileSync(`${publicDir}/pwa-maskable-512x512.png`, createPNG(512, 512, (x, y, w, h) => drawIcon(x, y, w, h, true)));
console.log('Created pwa-maskable-512x512.png');

fs.writeFileSync(`${publicDir}/apple-touch-icon.png`, createPNG(180, 180, (x, y, w, h) => drawIcon(x, y, w, h, false)));
console.log('Created apple-touch-icon.png');

fs.writeFileSync(`${publicDir}/favicon.ico`, createPNG(48, 48, (x, y, w, h) => drawIcon(x, y, w, h, false)));
console.log('Created favicon.ico');

console.log('All icons generated successfully!');
