import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

app.get("/fio", async (req, res) => {
  try {
    const r = await fetch("https://www.fio.cz/ib_api/rest/by-id/2803344316.json");
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nepodařilo se načíst Fio data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy běží na portu ${PORT}`));
