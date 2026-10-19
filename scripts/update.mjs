// Fetches the daily Brent crude spot price and writes brent.json.
// Source: U.S. Energy Information Administration, Crude Oil Prices: Brent -
// Europe [DCOILBRENTEU], retrieved from FRED, Federal Reserve Bank of St. Louis.
// Runs in GitHub Actions; no API key needed.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const DAYS = 120;
const since = new Date(Date.now() - DAYS * 86400e3).toISOString().slice(0, 10);
const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU&cosd=${since}`;

const res = await fetch(url, { headers: { 'User-Agent': 'oil-price-feed (GitHub Actions)' } });
if (!res.ok) throw new Error(`FRED answered ${res.status}`);
const csv = await res.text();

// Lines look like "2026-10-14,84.36"; holidays have "." instead of a number.
const rows = csv
  .trim()
  .split('\n')
  .slice(1)
  .map((l) => l.split(','))
  .filter(([d, v]) => /^\d{4}-\d{2}-\d{2}$/.test(d) && v && v !== '.' && !Number.isNaN(Number(v)))
  .map(([d, v]) => [d, Math.round(Number(v) * 100) / 100]);

if (rows.length < 2) throw new Error('Not enough price data in the response');

const latest = rows[rows.length - 1];
const previous = rows[rows.length - 2];
const out = {
  series: 'Brent crude oil spot price',
  unit: 'USD per barrel',
  source: 'U.S. Energy Information Administration via FRED (DCOILBRENTEU), Federal Reserve Bank of St. Louis',
  sourceUrl: 'https://fred.stlouisfed.org/series/DCOILBRENTEU',
  latest: { date: latest[0], price: latest[1] },
  previous: { date: previous[0], price: previous[1] },
  history: rows.slice(-60),
};

const file = 'brent.json';
const before = existsSync(file) ? readFileSync(file, 'utf8') : '';
const after = JSON.stringify(out, null, 1) + '\n';
if (before === after) {
  console.log('No change:', latest[0], latest[1]);
} else {
  writeFileSync(file, after);
  console.log('Updated:', latest[0], latest[1], '(previous', previous[0], previous[1] + ')');
}
