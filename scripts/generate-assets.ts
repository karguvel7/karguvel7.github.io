/**
 * Generates public/og.jpg and public/Karguvel-K-Resume.pdf from lib/content.ts (verified copy only).
 */
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";
import sharp from "sharp";
import { experience, projects, site, skillGroups, stack } from "../lib/content";

const publicDir = path.join(process.cwd(), "public");

async function generateOgImage() {
  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080B12"/>
      <stop offset="55%" stop-color="#0f1728"/>
      <stop offset="100%" stop-color="#121a2e"/>
    </linearGradient>
    <linearGradient id="beam" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0"/>
      <stop offset="45%" stop-color="#22d3ee" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="280" width="1200" height="4" fill="url(#beam)"/>
  <text x="88" y="268" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" fill="#eef2f8">Karguvel K</text>
  <text x="88" y="340" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="600" fill="#67e8f9">AI Architect</text>
  <text x="88" y="392" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">Production AI systems · Cloud · Enterprise software</text>
  <text x="88" y="560" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#64748b">karguvel7.github.io</text>
</svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(path.join(publicDir, "og.jpg"));
}

function writePdf(): Promise<void> {
  return new Promise((resolve, reject) => {
    const out = path.join(publicDir, "Karguvel-K-Resume.pdf");
    const doc = new PDFDocument({ size: "LETTER", margin: 54 });
    const stream = createWriteStream(out);
    doc.pipe(stream);

    const h1 = (text: string) => {
      doc.moveDown(0.4).font("Helvetica-Bold").fontSize(13).fillColor("#111827").text(text);
    };
    const h2 = (text: string) => {
      doc.moveDown(0.25).font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text(text);
    };
    const body = (text: string) => {
      doc.moveDown(0.15).font("Helvetica").fontSize(10).fillColor("#334155").text(text, { lineGap: 2 });
    };
    const bullet = (text: string) => {
      doc.font("Helvetica").fontSize(10).fillColor("#334155").text(`• ${text}`, { indent: 12, lineGap: 1 });
    };

    doc.font("Helvetica-Bold").fontSize(22).fillColor("#0f172a").text(site.fullName);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#0e7490").text(site.jobTitle);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#475569")
      .text(`${site.location} · ${site.email} · ${site.url.replace("https://", "")}`);
    doc.text(`GitHub: ${site.github} · LinkedIn: ${site.linkedin}`);

    h1("Summary");
    body(site.description);
    body(site.summary);

    h1("Experience — Innoart Technologies Private Limited");
    body(`${experience.tenure} · ${experience.continuity}`);
    for (const role of experience.roles) {
      h2(`${role.title} (${role.dates})${role.current ? " — current" : ""}`);
    }
    h2("Scope");
    for (const item of experience.scope.slice(0, 6)) bullet(item);

    h1("Education");
    for (const ed of experience.education) {
      body(`${ed.credential} — ${ed.school}`);
    }

    h1("Technical skills");
    for (const group of skillGroups) {
      body(`${group.title}: ${group.items.join(", ")}`);
    }

    h1("Selected systems");
    for (const project of projects.slice(0, 5)) {
      h2(project.title);
      body(project.summary);
      body(`Outcome: ${project.outcome}`);
    }

    h1("Stack highlights");
    for (const row of stack.slice(0, 8)) {
      body(`${row.area}: ${row.technologies}`);
    }

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  await generateOgImage();
  await writePdf();
  console.log("Generated public/og.jpg and public/Karguvel-K-Resume.pdf");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
