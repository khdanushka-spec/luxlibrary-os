import sharp from "sharp";
import { mkdirSync } from "fs";

const BG = "#100d0a";
const GOLD = "#ddb056";

mkdirSync("public/icons", { recursive: true });

function logoGroup(scale, translate) {
  return `<g transform="translate(${translate},${translate}) scale(${scale})">
    <path d="M6 5.5C6 4.67 6.67 4 7.5 4H15v24H7.5A1.5 1.5 0 0 1 6 26.5v-21Z" fill="${GOLD}" fill-opacity="0.25" stroke="${GOLD}" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M26 5.5c0-.83-.67-1.5-1.5-1.5H17v24h7.5a1.5 1.5 0 0 0 1.5-1.5v-21Z" fill="${GOLD}" fill-opacity="0.1" stroke="${GOLD}" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M16 4v24" stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round"/>
  </g>`;
}

function iconSvg({ size, cornerRadius, contentScale }) {
  const logoBoxSize = size * contentScale;
  const scale = logoBoxSize / 32;
  const translate = (size - logoBoxSize) / 2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="${BG}"/>
    ${logoGroup(scale, translate)}
  </svg>`;
}

const targets = [
  { name: "icon-192.png", size: 192, cornerRadius: 36, contentScale: 0.625 },
  { name: "icon-512.png", size: 512, cornerRadius: 96, contentScale: 0.625 },
  { name: "icon-maskable-512.png", size: 512, cornerRadius: 0, contentScale: 0.5 },
  { name: "apple-touch-icon.png", size: 180, cornerRadius: 0, contentScale: 0.6 },
];

for (const t of targets) {
  const svg = iconSvg(t);
  await sharp(Buffer.from(svg)).png().toFile(`public/icons/${t.name}`);
  console.log("wrote", t.name);
}
