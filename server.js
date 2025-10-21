import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 🔗 URL tvého transparentního účtu (veřejná)
const FIO_URL = "https://ib.fio.cz/ib/transparent?a=2803344316";

// 🧠 pomocná funkce pro převod "10 000,50 Kč" → 10000.5
function parseAmount(text) {
  return parseFloat(text.replace(/[^\d,]/g, "").replace(",", "."));
}

// 📡 Endpoint: /fio – načte HTML z Fio a vytáhne data
app.get("/fio", async (req, res) => {
  try {
    const response = await fetch(FIO_URL);
    const html = await response.text();

    // 🟨 najdi zůstatek
    const matchBalance = html.match(/Zůstatek:<\/th>\s*<td[^>]*>(.*?)<\/td>/);
    const balanceText = matchBalance ? matchBalance[1].trim() : "0 Kč";
    const balance = parseAmount(balanceText);

    // 🟩 spočítej počet transakcí
    const transactions = (html.match(/<tr class="zaznam/g) || []).length;

    res.json({
      balance,
      balanceText,
      transactions,
      source: "public_html",
    });
  } catch (err) {
    console.error("❌ Chyba při načítání Fio HTML:", err);
    res.status(500).json({ error: "Nepodařilo se načíst veřejná Fio data" });
  }
});

// 🚀 Start serveru
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy (HTML verze) běží na portu ${PORT}`));
