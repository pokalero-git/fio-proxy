// ✅ server.js – Fio HTML proxy
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// 🔁 Funkce pro načtení zůstatku z veřejného HTML Fio transparentního účtu
async function fetchFioBalance() {
  try {
    const response = await fetch("https://ib.fio.cz/ib/transparent?a=2803344316");
    const html = await response.text();

    const match = html.match(/Zůstatek[\s\S]*?<td[^>]*>([\d\s,]+) Kč<\/td>/i);
    const balance = match ? match[1].trim().replace(/\s/g, "") : "0";

    const now = new Date().toLocaleTimeString("cs-CZ", { hour12: false });
    console.log(`✅ Fio balance načten: ${balance} Kč (${now})`);

    return balance;
  } catch (err) {
    const now = new Date().toLocaleTimeString("cs-CZ", { hour12: false });
    console.error(`❌ Fio HTML error (${now}):`, err);
    return "0";
  }
}

// 🧠 Poslední známý zůstatek
let lastBalance = "0";

// 🌍 Domovská stránka (informace o proxy)
app.get("/", (req, res) => {
  res.send("💛 Fio proxy běží. Použij endpoint /fio pro JSON výstup.");
});

// 🌐 Endpoint vrací poslední načtený zůstatek
app.get("/fio", (req, res) => {
  res.json({ balance: lastBalance });
});

// 🕒 Načítání každé 3 minuty (180 000 ms)
setInterval(async () => {
  lastBalance = await fetchFioBalance();
}, 180000);

// ⏱️ První načtení ihned po startu
fetchFioBalance().then((bal) => (lastBalance = bal));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy běží na portu ${PORT}`));
