// ✅ Fio transparentní účet proxy – funguje pro veřejná data

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

const app = express();
app.use(cors({ origin: "*" }));

app.get("/fio", async (req, res) => {
  try {
    const xmlUrl = "https://www.fio.cz/scgi-bin/hermes/dz-transparent.cgi?ID_ucet=2803344316";
    const response = await fetch(xmlUrl);
    const xml = await response.text();
    const json = await parseStringPromise(xml, { explicitArray: false });
    res.json(json);
  } catch (err) {
    console.error("❌ Fio XML error:", err.message);
    res.status(500).json({ error: "Nepodařilo se načíst nebo převést Fio XML" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Fio proxy běží správně! Použij /fio pro data.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Proxy běží na portu ${PORT}`);
});
