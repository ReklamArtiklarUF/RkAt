import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, normalize, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.CONTACT_PORT || process.env.PORT || 3010);
const CONFIG_PATH = process.env.CONTACT_CONFIG_PATH || "/etc/reklamartiklar/contact.env";
const STATIC_ROOT = process.env.STATIC_ROOT || join(__dirname, "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const fileEnv = loadEnvFile(CONFIG_PATH);
const cfg = { ...fileEnv, ...process.env };

function required(name) {
  const value = cfg[name];
  if (!value) throw new Error(`Saknar config: ${name}`);
  return value;
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function safeStaticPath(pathname) {
  const decoded = decodeURIComponent(pathname.split("?")[0] || "/");
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const resolved = normalize(join(STATIC_ROOT, relative));
  if (!resolved.startsWith(normalize(STATIC_ROOT))) return null;
  return resolved;
}

function sendFile(res, filePath) {
  const data = readFileSync(filePath);
  const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": data.length,
    "Cache-Control": extname(filePath) === ".html" ? "no-cache" : "public, max-age=604800",
  });
  res.end(data);
}

function serveStatic(req, res, pathname) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    res.end();
    return;
  }

  let filePath = safeStaticPath(pathname);
  if (!filePath) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    if (req.method === "HEAD") {
      const { size } = statSync(filePath);
      res.writeHead(200, {
        "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream",
        "Content-Length": size,
      });
      res.end();
      return;
    }
    sendFile(res, filePath);
    return;
  }

  // React Router fallback
  const indexPath = join(STATIC_ROOT, "index.html");
  if (!existsSync(indexPath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  if (req.method === "HEAD") {
    res.writeHead(200, { "Content-Type": MIME[".html"] });
    res.end();
    return;
  }
  sendFile(res, indexPath);
}

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const secure = String(cfg.SMTP_SECURE || "").toLowerCase() === "true" || cfg.SMTP_PORT === "465";
  const rejectUnauthorized = String(cfg.SMTP_TLS_REJECT_UNAUTHORIZED || "true").toLowerCase() !== "false";
  transporter = nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port: Number(cfg.SMTP_PORT || (secure ? 465 : 587)),
    secure,
    auth: {
      user: required("SMTP_USER"),
      pass: required("SMTP_PASS"),
    },
    requireTLS: !secure,
    tls: { rejectUnauthorized },
  });
  return transporter;
}

async function handleContact(req, res) {
  try {
    const raw = await readBody(req);
    const body = raw ? JSON.parse(raw) : {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const cartSummary = typeof body.cartSummary === "string" ? body.cartSummary.trim() : "";

    if (!name || !email || !message || !email.includes("@")) {
      json(res, 400, { error: "Fyll i namn, giltig e-post och meddelande." });
      return;
    }

    const to = required("CONTACT_TO");
    const from = cfg.CONTACT_FROM || cfg.SMTP_USER;
    const text = [
      `Namn: ${name}`,
      `E-post: ${email}`,
      "",
      "Meddelande:",
      message,
      cartSummary ? `\nKundvagn:\n${cartSummary}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await getTransporter().sendMail({
      from,
      to,
      replyTo: email,
      subject: `Ny kontaktförfrågan från ${name.replace(/[\r\n]/g, "")}`,
      text,
    });

    json(res, 200, { success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Okänt fel";
    if (message.startsWith("Saknar config:")) {
      json(res, 503, { error: "Kontaktformuläret är inte konfigurerat på servern ännu." });
      return;
    }
    const detail = error instanceof Error ? error.message : String(error);
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    const response = error && typeof error === "object" && "response" in error ? String(error.response) : "";
    console.error("contact error:", { detail, code, response });
    json(res, 502, { error: "Meddelandet kunde inte skickas just nu." });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "POST" && url.pathname === "/api/contact") {
    await handleContact(req, res);
    return;
  }

  serveStatic(req, res, url.pathname);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`server lyssnar på http://127.0.0.1:${PORT}`);
  console.log(`static root: ${STATIC_ROOT}`);
});
