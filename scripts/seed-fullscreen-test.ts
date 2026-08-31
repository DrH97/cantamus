/**
 * Seed a mass program that exercises the fullscreen sheet-music viewer on
 * /events/[date].
 *
 * Generates two score files into public/scores/ (gitignored) and attaches them
 * to hymns in a program dated on the next third Sunday, so the entry shows up
 * on /events and the program page links from it:
 *
 *   - test-score.png  → the <img> branch of the viewer
 *   - test-score.pdf  → the <iframe> branch of the viewer
 *
 * The PNG carries four coloured corner squares (TL red, TR green, BL blue,
 * BR magenta) and an edge ruler. In fullscreen all four corners must stay
 * visible — if one is missing the image is being cropped rather than fitted.
 * The PDF is two pages so you can scroll inside the fullscreened iframe.
 *
 * Usage:
 *   npx tsx scripts/seed-fullscreen-test.ts
 *   npx tsx scripts/seed-fullscreen-test.ts --clean   # undo
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync } from "node:zlib";
import { createClient } from "@libsql/client";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const DB_URL = process.env.DATABASE_URL ?? "file:./data/local.db";
const DB_TOKEN = process.env.DATABASE_AUTH_TOKEN;

const PROGRAM_DATE = nextThirdSunday();
const PROGRAM_TITLE = "Score Viewer Test — fullscreen sheet music";
const SCORES_DIR = join(process.cwd(), "public", "scores");
const PNG_URL = "/scores/test-score.png";
const PDF_URL = "/scores/test-score.pdf";

// ── PNG generation ─────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = -1;
  for (const byte of buf) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Portrait "score page" with corner markers, staves and an edge ruler. */
function buildScorePng(width: number, height: number): Buffer {
  const px = Buffer.alloc(width * height * 3, 0xff);

  const set = (x: number, y: number, r: number, g: number, b: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = (y * width + x) * 3;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
  };
  const rect = (
    x0: number,
    y0: number,
    w: number,
    h: number,
    r: number,
    g: number,
    b: number,
  ) => {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) set(x, y, r, g, b);
    }
  };
  const disc = (cx: number, cy: number, rad: number) => {
    for (let y = cy - rad; y <= cy + rad; y++) {
      for (let x = cx - rad; x <= cx + rad; x++) {
        const dx = (x - cx) / 1.35;
        const dy = y - cy;
        if (dx * dx + dy * dy <= rad * rad) set(x, y, 0x11, 0x11, 0x11);
      }
    }
  };

  // Page border — a thin frame proves nothing is clipped in fullscreen.
  rect(0, 0, width, 6, 0x11, 0x11, 0x11);
  rect(0, height - 6, width, 6, 0x11, 0x11, 0x11);
  rect(0, 0, 6, height, 0x11, 0x11, 0x11);
  rect(width - 6, 0, 6, height, 0x11, 0x11, 0x11);

  // Corner markers: TL red, TR green, BL blue, BR magenta.
  const m = 90;
  rect(14, 14, m, m, 0xd9, 0x25, 0x25);
  rect(width - 14 - m, 14, m, m, 0x1f, 0xa2, 0x4f);
  rect(14, height - 14 - m, m, m, 0x24, 0x63, 0xeb);
  rect(width - 14 - m, height - 14 - m, m, m, 0xc0, 0x26, 0xd3);

  // Edge ruler: a tick every 100px down the left margin.
  for (let y = 200; y < height - 200; y += 100) {
    rect(14, y, (y / 100) % 5 === 0 ? 60 : 34, 5, 0x11, 0x11, 0x11);
  }

  // Staves.
  const left = 140;
  const right = width - 140;
  const staffGap = 26;
  for (let s = 0; s < 8; s++) {
    const top = 220 + s * 170;
    for (let line = 0; line < 5; line++) {
      rect(left, top + line * staffGap, right - left, 3, 0x11, 0x11, 0x11);
    }
    // Noteheads with stems, walking across the staff.
    for (let n = 0; n < 9; n++) {
      const cx = left + 70 + n * ((right - left - 120) / 8);
      const cy = top + ((n + s) % 9) * (staffGap / 2);
      disc(Math.round(cx), Math.round(cy), 13);
      rect(Math.round(cx) + 16, cy - 78, 4, 78, 0x11, 0x11, 0x11);
    }
  }

  // Scanlines, each prefixed with filter byte 0.
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 3)] = 0;
    px.copy(raw, y * (1 + width * 3) + 1, y * width * 3, (y + 1) * width * 3);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── PDF generation ─────────────────────────────────────────────────

function pageContent(pageNo: number): string {
  const ops: string[] = [
    "BT /F1 22 Tf 60 782 Td (Fullscreen Test Score) Tj ET",
    `BT /F1 12 Tf 60 760 Td (Page ${pageNo} of 2 - scroll inside the fullscreened frame to reach the other page) Tj ET`,
    // Corner markers, matching the PNG.
    "0.85 0.15 0.15 rg 30 782 30 30 re f",
    "0.12 0.64 0.31 rg 535 782 30 30 re f",
    "0.14 0.39 0.92 rg 30 30 30 30 re f",
    "0.75 0.15 0.83 rg 535 30 30 30 re f",
    "0 0 0 RG 1 w",
  ];
  // Staves.
  for (let s = 0; s < 6; s++) {
    const top = 700 - s * 105;
    for (let line = 0; line < 5; line++) {
      const y = top - line * 12;
      ops.push(`60 ${y} m 535 ${y} l S`);
    }
  }
  return ops.join("\n");
}

function buildScorePdf(): Buffer {
  const objects: string[] = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R 5 0 R]/Count 2>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 7 0 R>>>>/Contents 4 0 R>>",
    streamObject(pageContent(1)),
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 7 0 R>>>>/Contents 6 0 R>>",
    streamObject(pageContent(2)),
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "latin1");
}

function streamObject(content: string): string {
  return `<</Length ${Buffer.byteLength(content, "latin1")}>>\nstream\n${content}\nendstream`;
}

// ── Dates ──────────────────────────────────────────────────────────

function toSlug(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Mirrors getThirdSundays() in data/events.ts so the program lands on a card. */
function nextThirdSunday(): string {
  const now = new Date();
  for (let i = 0; i < 3; i++) {
    const probe = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const firstDay = probe.getDay();
    const firstSunday = firstDay === 0 ? 1 : 8 - firstDay;
    const third = new Date(
      probe.getFullYear(),
      probe.getMonth(),
      firstSunday + 14,
    );
    if (third >= now) return toSlug(third);
  }
  throw new Error("no upcoming third Sunday found");
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const clean = process.argv.includes("--clean");
  const client = createClient({ url: DB_URL, authToken: DB_TOKEN });
  const db = drizzle(client, { schema });

  async function dropProgram() {
    const existing = await db.query.massPrograms.findFirst({
      where: eq(schema.massPrograms.date, PROGRAM_DATE),
    });
    if (!existing) return false;
    await db
      .delete(schema.massProgramSongs)
      .where(eq(schema.massProgramSongs.massProgramId, existing.id));
    await db
      .delete(schema.massPrograms)
      .where(eq(schema.massPrograms.id, existing.id));
    return true;
  }

  if (clean) {
    const dropped = await dropProgram();
    const cleared = await db
      .update(schema.hymns)
      .set({ scoreUrl: null })
      .where(inArray(schema.hymns.scoreUrl, [PNG_URL, PDF_URL]))
      .returning({ title: schema.hymns.title });
    console.log(
      `Removed program for ${PROGRAM_DATE}: ${dropped ? "yes" : "none found"}`,
    );
    console.log(`Cleared test score URLs from ${cleared.length} hymn(s).`);
    console.log("Score files in public/scores/ were left in place.");
    process.exit(0);
  }

  // ── 1. Score files ───────────────────────────────────────────────
  mkdirSync(SCORES_DIR, { recursive: true });
  const png = buildScorePng(1200, 1700);
  writeFileSync(join(SCORES_DIR, "test-score.png"), png);
  const pdf = buildScorePdf();
  writeFileSync(join(SCORES_DIR, "test-score.pdf"), pdf);
  console.log(
    `Wrote public/scores/test-score.png (${Math.round(png.length / 1024)} KB, 1200×1700)`,
  );
  console.log(
    `Wrote public/scores/test-score.pdf (${Math.round(pdf.length / 1024)} KB, 2 pages)`,
  );

  // ── 2. Hymns ─────────────────────────────────────────────────────
  async function findOrCreateHymn(
    title: string,
    extra?: Partial<typeof schema.hymns.$inferInsert>,
  ) {
    const existing = await db.query.hymns.findFirst({
      where: eq(schema.hymns.title, title),
    });
    if (existing) return existing.id;
    const [row] = await db
      .insert(schema.hymns)
      .values({ title, ...extra })
      .returning({ id: schema.hymns.id });
    return row.id;
  }

  async function setScore(hymnId: number, url: string | null) {
    await db
      .update(schema.hymns)
      .set({ scoreUrl: url })
      .where(eq(schema.hymns.id, hymnId));
  }

  console.log("\nAttaching scores...");
  const imageHymnId = await findOrCreateHymn("Attende Domine", {
    tradition: "gregorian",
    language: "la",
  });
  const pdfHymnId = await findOrCreateHymn("Indodana", {
    tradition: "african",
  });
  const secondImageHymnId = await findOrCreateHymn("Himno a San José", {
    language: "es",
  });
  const noScoreHymnId = await findOrCreateHymn("The Lord is my Shepherd", {
    composer: "Heather Sorenson",
    tradition: "contemporary",
    language: "en",
  });

  await setScore(imageHymnId, PNG_URL);
  await setScore(pdfHymnId, PDF_URL);
  await setScore(secondImageHymnId, PNG_URL);
  await setScore(noScoreHymnId, null);
  console.log(`  PNG → Attende Domine (id=${imageHymnId})`);
  console.log(`  PDF → Indodana (id=${pdfHymnId})`);
  console.log(`  PNG → Himno a San José (id=${secondImageHymnId})`);
  console.log(`  none → The Lord is my Shepherd (id=${noScoreHymnId})`);

  // ── 3. Program ───────────────────────────────────────────────────
  await dropProgram();
  const [prog] = await db
    .insert(schema.massPrograms)
    .values({ date: PROGRAM_DATE, title: PROGRAM_TITLE })
    .returning({ id: schema.massPrograms.id });

  const songs = [
    { hymnId: imageHymnId, section: "prelude", order: 0 },
    { hymnId: noScoreHymnId, section: "offertory", order: 0 },
    { hymnId: pdfHymnId, section: "communion", order: 0 },
    { hymnId: secondImageHymnId, section: "recessional", order: 0 },
  ];
  for (const s of songs) {
    await db.insert(schema.massProgramSongs).values({
      massProgramId: prog.id,
      hymnId: s.hymnId,
      massSection: s.section,
      sortOrder: s.order,
    });
  }

  console.log(`\nSeeded program ${PROGRAM_DATE} (id=${prog.id}).`);
  console.log(`Open /events/${PROGRAM_DATE} on your dev server.`);
  console.log(
    "\nWhat to check — click the sheet-music icon on an entry, then the",
  );
  console.log("expand icon that appears next to it:");
  console.log("  Prelude (image)     all four coloured corners stay visible");
  console.log("  Offertory (none)    no score icon at all — control case");
  console.log("  Communion (PDF)     iframe fills the screen, scrolls 2 pages");
  console.log("  Recessional (image) Esc and the overlay button both exit");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
