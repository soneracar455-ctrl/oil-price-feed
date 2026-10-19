# oil-price-feed

Daily Brent crude oil spot price for the game *Oil Planets* (working title).

`brent.json` is refreshed automatically by GitHub Actions twice a day
(`.github/workflows/update.yml` → `scripts/update.mjs`). The game reads it
from `https://raw.githubusercontent.com/soneracar455-ctrl/oil-price-feed/main/brent.json`
and keeps working with the last price it saw when offline.

**Source:** U.S. Energy Information Administration, Crude Oil Prices: Brent -
Europe [DCOILBRENTEU], retrieved from FRED, Federal Reserve Bank of St. Louis;
https://fred.stlouisfed.org/series/DCOILBRENTEU

This repository must stay **public**, or phones cannot read the file.
