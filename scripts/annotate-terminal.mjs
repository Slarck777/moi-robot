import sharp from "sharp";

const W = 1280, H = 1021;

// Координаты терминала
const TX = 28, TY = 198, TW = 238, TH = 760;
const pad = 16;
const rx = TX - pad, ry = TY - pad;
const rw = TW + pad * 2, rh = TH + pad * 2;
const cx = Math.round(rx + rw / 2);

const BLUE = "#00AEEF";

// Стрелка сверху — над терминалом
const arrowCX = cx;
const arrowTopY = 30;
const arrowBottomY = ry - 20;

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="8" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Синяя рамка вокруг терминала -->
  <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}"
    rx="10" fill="none"
    stroke="${BLUE}" stroke-width="6"
    filter="url(#shadow)"/>

  <!-- Большая синяя стрелка вниз над терминалом -->
  <!-- Тело стрелки -->
  <rect x="${arrowCX - 28}" y="${arrowTopY}" width="56" height="${arrowBottomY - arrowTopY - 60}"
    fill="${BLUE}" rx="8" filter="url(#shadow)"/>
  <!-- Наконечник -->
  <polygon
    points="${arrowCX - 82},${arrowBottomY - 64} ${arrowCX + 82},${arrowBottomY - 64} ${arrowCX},${arrowBottomY}"
    fill="${BLUE}" filter="url(#shadow)"/>
</svg>`;

await sharp("./public/terminal-photo.jpg")
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .jpeg({ quality: 94 })
  .toFile("./public/terminal-annotated.jpg");

console.log("✅ Готово: public/terminal-annotated.jpg");
