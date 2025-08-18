# PWA & Offline

Add installability and offline support using `vite-plugin-pwa`.

Steps
1. Install: `npm i -D vite-plugin-pwa workbox-window`
2. Update `astrology-chart/vite.config.ts` with plugin and manifest
3. Precache: core HTML, JS, CSS, fonts, critical images
4. Runtime caching: same‑origin assets; optional gateway caching strategies

Notes
- Keep all assets local for IPFS mirror
- Test offline and on multiple gateways
