import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import xml2js from "xml2js";

const app = express();
app.use(cors());

app.get("/fio", async (req, res) => {
  try {
    const response = await fetch("https://ib.fio.cz/ib/transparent?a=2803344316");
    const html = await response.text();

    const match = html.match(/Zůstatek[\s\S]*?<td[^>]*>([\d\s,]+) Kč<\/td>/i);
    const balance = match ? match[1].trim().replace(/\s/g, "") : "0";

    res.json({ balance });
    console.log("✅ Fio balance načten:", balance);
  } catch (err) {
    console.error("❌ Fio API error:", err);
    res.status(500).json({ error: "Nepodařilo se načíst data z Fio" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy běží na portu ${PORT}`));
