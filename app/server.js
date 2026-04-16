const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

const BASE_URL = process.env.SPEEDTEST_URL;
const API_KEY = process.env.SPEEDTEST_API_KEY;

async function fetchWithRetry(url, options = {}, { retries = 3, delay = 500, backoff = 2 } = {}) {
  let attempt = 0;
  let currentDelay = delay;

  while (attempt < retries) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      attempt++;
      if (attempt >= retries) throw err;
      await new Promise(r => setTimeout(r, currentDelay));
      currentDelay *= backoff;
    }
  }
}

app.get('/', async (_req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    const response = await fetchWithRetry(`${BASE_URL}/api/v1/stats?start_at=${start}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    const json = await response.json();
    const jsonData = json.data;
    const download = (jsonData.download.avg_bits / 1e6).toFixed(1);
    const upload = (jsonData.upload.avg_bits / 1e6).toFixed(1);
    const ping = Math.round(jsonData.ping.avg);

    res.send(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <div class="grid">
      <div class="card"><div class="label">Avg. Down</div><div class="value">${download}</div><div class="unit">Mbps</div></div>
      <div class="card"><div class="label">Avg. Up</div><div class="value">${upload}</div><div class="unit">Mbps</div></div>
      <div class="card"><div class="label">Avg. Ping</div><div class="value">${ping}</div><div class="unit">ms</div></div>
    </div>
  </body>
</html>`
    );
  } catch (err) {
    res.status(500).send(`<p class="error">Error: ${err.message}</p>`);
  }
});

app.listen(3000);