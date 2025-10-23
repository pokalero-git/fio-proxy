// ✅ server.js – HTML proxy pro Fio transparentní účet
import express from "express";
import fetch from "node-fetch";

const app = express();

let lastBalance = "Načítám...";
let lastUpdated = "nikdy";

// 🔁 Funkce pro načtení zůstatku z veřejného HTML Fio transparentního účtu
async function fetchFioBalance() {
  try {
    const response = await fetch("https://ib.fio.cz/ib/transparent?a=2803344316");
    const html = await response.text();

    const match = html.match(/Zůstatek[\s\S]*?<td[^>]*>([\d\s,]+) Kč<\/td>/i);
    const balance = match ? match[1].trim() : "0";

    const now = new Date().toLocaleString("cs-CZ", {
      timeZone: "Europe/Prague",
    });

    lastBalance = balance;
    lastUpdated = now;

    console.log(`✅ Načten zůstatek: ${balance} Kč (${now})`);
  } catch (err) {
    console.error("❌ Chyba při načítání Fio:", err);
  }
}

// 🕒 Aktualizace každé 3 minuty
setInterval(fetchFioBalance, 180000);
fetchFioBalance();

// 🌍 Hlavní HTML stránka
app.get("/", (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="cs">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Fio – aktuální zůstatek</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #f6f7fb; color: #222; text-align: center; padding: 50px; }
        h1 { font-size: 2rem; color: #0066cc; }
        p { font-size: 1.2rem; margin: 10px 0; }
        small { color: #666; }
      </style>
    </head>
    <body>
      <h1>💛 Desetikorunová výzva</h1>
      <p><strong>Aktuální zůstatek:</strong></p>
      <p style="font-size: 2rem;"><b>${lastBalance}</b> Kč</p>
      <small>Aktualizováno: ${lastUpdated}</small>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ HTML server běží na portu ${PORT}`));
