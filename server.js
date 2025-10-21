const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const FIO_URL = "https://ib.fio.cz/ib/transparent?a=2803344316";

function parseAmount(text) {
  return parseFloat(text.replace(/[^\d,]/g, "").replace(",", "."));
}

app.get("/fio", async (req, res) => {
  try {
    const response = await fetch(FIO_URL);
    const html = await response.text();

    const matchBalance = html.match(/Zůstatek:<\/th>\s*<td[^>]*>(.*?)<\/td>/);
    const balanceText = matchBalance ? matchBalance[1].trim() : "0 Kč";
    const balance = parseAmount(balanceText);
    const transactions = (html.match(/<tr class="zaznam/g) || []).length;

    res.json({
      balance,
      balanceText,
      transactions,
      source: "public_html"
    });
  } catch (err) {
    console.error("❌ Chyba při načítání Fio HTML:", err);
    res.status(500).json({ error: "Nepodařilo se načíst veřejná Fio data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy běží na portu ${PORT}`));
