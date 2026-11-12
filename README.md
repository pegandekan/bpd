# SIP-BPD Desa Pegandekan — Versi 1.2

Paket aplikasi SIP-BPD berbasis Google Sheets + Google Apps Script, dengan Cloudflare Worker sebagai alamat masuk/pengarah opsional.

## Isi aplikasi
- `Code.gs`: backend, autentikasi, hak akses, CRUD, audit log, dan pemeriksaan kesehatan.
- `Index.html`: halaman login dan aplikasi.
- `Styles.html`: desain responsif dan cetak.
- `Client.html`: navigasi, dashboard, formulir, pencarian, cetak, dan ekspor CSV.
- `appsscript.json`: manifest Google Apps Script.
- `wrangler.jsonc`, `src/worker.js`, `public/index.html`: konfigurasi Cloudflare Worker.
- `releases/v1.2/`: salinan paket Apps Script yang dibekukan untuk versi 1.2.

## Instalasi Google Apps Script

1. Buat Google Sheets baru bernama **Database SIP-BPD Desa Pegandekan**.
2. Dari spreadsheet, buka **Extensions > Apps Script**.
3. Salin isi `Code.gs` ke file Code.gs di editor.
4. Buat file HTML bernama persis `Index`, `Styles`, dan `Client`, lalu salin isi file HTML dari repositori. Jangan menambahkan ekstensi .html pada nama file di editor Apps Script.
5. Pastikan manifest `appsscript.json` menggunakan zona waktu Asia/Jakarta dan runtime V8.
6. Simpan proyek. Pilih fungsi `setupSystem`, jalankan, dan berikan izin. Fungsi ini membuat sheet inti dan 15 buku administrasi.
7. Jalankan `createInitialAdminWizard` untuk membuat admin awal. Password minimal 12 karakter.
8. Jalankan `systemHealthCheck` dan pastikan hasil `ok: true`.
9. Pilih **Deploy > New deployment > Web app**. Untuk pengujian internal, gunakan **Execute as: Me** dan batasi **Who has access** sesuai kebijakan organisasi.
10. Salin URL Web App yang berakhiran `/exec`.

## Hubungkan Cloudflare

1. Deploy Worker dari root repositori dengan `npx wrangler deploy`.
2. Pada Cloudflare, buka Worker **sip-bpd-pegandekan** > **Settings > Variables and Secrets**.
3. Tambahkan variable teks `SIP_BPD_GAS_URL` dengan URL Web App Apps Script yang berakhiran `/exec`.
4. Simpan dan lakukan redeploy bila diminta.
5. Buka domain Worker untuk menguji pengalihan ke aplikasi.

Cloudflare saat ini hanya menjadi pintu masuk/pengarah. Aplikasi berjalan di Google Apps Script karena frontend menggunakan `google.script.run`. Ini bukan reverse proxy penuh dan URL akhir browser akan menuju domain Google Apps Script.

## Opsi sinkronisasi menggunakan clasp

Untuk menggunakan clasp, salin `.clasp.example.json` menjadi `.clasp.json`, ganti `scriptId` dengan ID proyek Apps Script milik Anda, lalu jalankan:

```bash
npm install
npx clasp login
npx clasp push
```

Jangan commit `.clasp.json` yang berisi ID proyek pribadi ke repositori publik. Pastikan file HTML Apps Script bernama `Index`, `Styles`, dan `Client`.

## Catatan keamanan dan kesiapan

- Jangan menaruh password atau token sesi di konfigurasi Cloudflare.
- Batasi akses Web App untuk data administrasi internal. Jangan pilih akses publik tanpa audit keamanan.
- Jalankan pengujian login, hak akses setiap role, tambah, ubah, hapus, pencarian, cetak, dan ekspor sebelum memasukkan data resmi.
- Kode belum dapat diuji pada akun Google pemilik karena spreadsheet dan proyek Apps Script pengguna belum disediakan/ditautkan.
- Versi 1.2 merupakan paket konfigurasi dan deployment; bukan klaim bahwa aplikasi telah live atau bahwa migrasi backend ke Cloudflare telah selesai.

## Versi
- 1.2 — paket Apps Script dibekukan, manifest ditambahkan, dan panduan penghubungan Cloudflare diperjelas.
