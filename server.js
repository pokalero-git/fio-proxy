import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// 🔁 Funkce pro načtení zůstatku z Fio transparentního účtu
async function fetchFioBalance() {
  try {
    const response = await fetch("https://ib.fio.cz/ib/transparent?a=2803344316");
    const html = await response.text();

    const match = html.match(/Zůstatek[\s\S]*?<td[^>]*>([\d\s,]+) Kč<\/td>/i);
    const balance = match ? match[1].trim().replace(/\s/g, "") : "0";

    console.log("✅ Fio balance načten:", balance);
    return balance;
  } catch (err) {
    console.error("❌ Fio API error:", err);
    return "0";
  }
}

// 🧠 Poslední uložená hodnota (drží se v paměti)
let lastBalance = "0";

// 🌐 Endpoint, který vrací aktuální zůstatek
app.get("/fio", (req, res) => {
  res.json({ balance: lastBalance });
});

// 🕒 Spouštěj kontrolu každé 3 minuty (180 000 ms)
setInterval(async () => {
  lastBalance = await fetchFioBalance();
}, 180000);

// ⏱️ Pro jistotu načti hned při startu
fetchFioBalance().then((bal) => (lastBalance = bal));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy běží na portu ${PORT}`));
