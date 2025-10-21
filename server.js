// 📦 Fio Proxy Server
// Přeposílá veřejná data z Fio transparentního účtu
// Obejítí CORS pro použití na GitHub Pages

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: "*" }));

// 🧩 Endpoint pro získání dat z Fio API
app.get("/fio", async (req, res) => {
  try {
    const response = await fetch("https://www.fio.cz/ib_api/rest/by-account/2803344316/last.json");
    if (!response.ok) throw new Error("Chyba při načítání Fio API");
    const text = await response.text();

    // pokus o převod na JSON, pokud to není HTML
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("⚠️ Fio API nevrátilo JSON:", text.slice(0, 100));
      throw new Error("Neplatná odpověď z Fio API (HTML místo JSON)");
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Fio API error:", err.message);
    res.status(500).json({ error: "Nepodařilo se načíst data z Fio API" });
  }
});

// 🧠 Healthcheck (pro kontrolu Railway)
app.get("/", (req, res) => {
  res.send("✅ Fio proxy běží správně! Použij /fio pro data.");
});

// 🚀 Spuštění serveru
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Proxy běží na portu ${PORT}`);
});
