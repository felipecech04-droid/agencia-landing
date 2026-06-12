import express from "express";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import config from "./config.js";
import { handleMessage } from "./bot.js";
import { getLeads } from "./leads.js";

const app = express();
app.use(express.json());

let clientReady = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ["--no-sandbox"] },
});

client.on("qr", (qr) => {
  console.log("\n🔐 Escanea este QR con WhatsApp:\n");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  clientReady = true;
  console.log(`\n✅ Bot conectado como: ${client.info?.pushname || "WhatsApp"}`);
});

client.on("message", async (msg) => {
  if (msg.from === config.ownerNumber) return;
  if (msg.isStatus) return;

  const reply = handleMessage(msg);
  if (reply) {
    await msg.reply(reply);
    console.log(`💬 Respondido a ${msg.from}: "${msg.body?.slice(0, 50)}..."`);
  }
});

// API endpoints
app.get("/health", (_, res) => {
  res.json({ status: clientReady ? "connected" : "connecting", bot: config.botName });
});

app.get("/leads", (_, res) => {
  res.json(getLeads());
});

app.post("/send", async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: "Faltan campos: to, message" });
  }
  try {
    const number = to.includes("@c.us") ? to : `${to}@c.us`;
    await client.sendMessage(number, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(config.port, () => {
  console.log(`\n🌐 API del bot en http://localhost:${config.port}`);
  console.log(`   Health: http://localhost:${config.port}/health`);
  console.log(`   Leads:  http://localhost:${config.port}/leads`);
});

client.initialize();
