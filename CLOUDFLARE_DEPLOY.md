# Deployment Cloudflare — SIP-BPD Desa Pegandekan

## Arsitektur

Repositori SIP-BPD saat ini berisi aplikasi Google Apps Script. Frontend menggunakan `google.script.run`, sehingga aplikasi tidak dapat dijalankan sebagai static site Cloudflare tanpa migrasi backend.

Pada konfigurasi ini Cloudflare Worker menjadi pintu masuk dan mengarahkan pengguna ke Google Apps Script Web App. Google Sheets tetap menjadi database.

## Perbaikan error Wrangler

Konfigurasi `wrangler.jsonc` mendefinisikan:
- Worker entry point: `src/worker.js`
- Static assets directory: `public`
- Asset binding: `ASSETS`

Perintah deployment:

```bash
npx wrangler deploy
```

## Konfigurasi wajib setelah deployment

1. Deploy Worker dari Cloudflare.
2. Buka **Workers & Pages** lalu pilih Worker `sip-bpd-pegandekan`.
3. Buka **Settings > Variables and Secrets**.
4. Tambahkan variable teks bernama `SIP_BPD_GAS_URL`.
5. Isi dengan URL Web App Google Apps Script yang sudah di-deploy, contoh format:

   `https://script.google.com/macros/s/DEPLOYMENT_ID/exec`

6. Simpan perubahan dan lakukan redeploy bila diminta.
7. Buka domain Worker dan pastikan diarahkan ke halaman login SIP-BPD.

## Catatan

- Jangan masukkan password, token sesi, atau kredensial Google ke variabel publik.
- URL Web App harus menggunakan HTTPS dan berakhiran `/exec`.
- Atur akses Web App sesuai kebijakan keamanan BPD. Jangan membuka akses data internal kepada publik tanpa peninjauan hak akses.
- Cloudflare pada tahap ini bukan pengganti Google Apps Script. Migrasi penuh ke Cloudflare Workers + D1 memerlukan implementasi ulang API, autentikasi, dan akses database.
