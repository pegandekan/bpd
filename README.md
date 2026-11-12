# SIP-BPD Desa Pegandekan — Rebuild GAS 1.1

Paket pembangunan ulang SIP-BPD menggunakan Google Sheets sebagai database dan Google Apps Script sebagai backend. Cloudflare tidak digunakan.

## Isi paket
- `Code.gs`: backend, struktur 15 buku, modul kerja, autentikasi, hak akses, CRUD berbasis ID, audit log, pencarian server-side, dan pemeriksaan kesehatan sistem.
- `Index.html`: halaman login dan aplikasi.
- `Styles.html`: desain responsif dan tata letak cetak.
- `Client.html`: navigasi, dashboard, formulir dinamis, pencarian, cetak, dan ekspor CSV.

## Instalasi baru
1. Buat Google Sheets BARU bernama `Database SIP-BPD Desa Pegandekan`.
2. Buka **Extensions > Apps Script** dari spreadsheet tersebut.
3. Ganti isi `Code.gs` dengan file dalam paket.
4. Buat file HTML bernama persis `Index`, `Styles`, dan `Client` (tanpa `.html` di editor Apps Script), lalu salin konten masing-masing.
5. Simpan, pilih fungsi `setupSystem`, jalankan dan berikan izin. Fungsi ini menyiapkan 23 sheet: 8 sheet inti (konfigurasi, pengguna, 5 modul kerja, audit log) dan 15 buku administrasi.
6. Pilih `createInitialAdminWizard`, jalankan untuk membuat admin awal. Username: `admin`; password minimal 12 karakter.
7. Jalankan `systemHealthCheck()` untuk memeriksa struktur sheet.
8. Deploy > New deployment > Web app. Untuk uji coba pilih **Execute as: Me** dan **Who has access: Only myself**.
9. Uji login, tambah, ubah, pencarian, hapus, cetak, dan ekspor CSV dengan data contoh sebelum memasukkan data sebenarnya.

## Fitur Rebuild 1.1
- Dashboard dengan ringkasan metrik dan rekap jumlah data untuk seluruh 15 buku.
- Form input otomatis mengikuti tipe kolom (tanggal, angka, pilihan, teks, uraian).
- Tambah dan ubah menggunakan ID unik; permintaan edit dengan ID yang tidak ditemukan ditolak.
- Hapus hanya untuk Admin BPD/Ketua BPD.
- Pencarian lintas kolom pada setiap buku/modul.
- Cetak tabel/dashboard dan ekspor CSV.
- Audit log untuk login, logout, tambah, ubah, dan hapus.

## Hak akses saat ini
- Admin BPD/Ketua BPD: dapat membaca/menambah/mengubah semua buku dan modul; dapat menghapus.
- Anggota BPD: dapat membaca/menambah/mengubah buku dan modul kerja kecuali Buku 5 dan Buku 7; tidak dapat menghapus.
- Pemerintah Desa: akses baca untuk buku/modul yang diizinkan; tidak dapat mengubah.
- Masyarakat: belum diberi akses login.

## Catatan penting
- Gunakan spreadsheet baru. `setupSystem()` tidak menghapus data; jika header tidak cocok, proses dihentikan.
- Fitur manajemen pengguna belum memiliki layar admin; pembuatan pengguna tambahan sementara melalui fungsi `apiCreateUser` yang memerlukan token sesi admin. Menu admin akan dibuat pada iterasi berikutnya.
- Password disimpan sebagai hash dengan salt dan iterasi SHA-256. Ini bukan pengganti penyedia identitas khusus; batasi deployment, aktifkan verifikasi dua langkah pada akun Google, dan jangan membuka aplikasi internal untuk publik.
- Versi ini belum diuji langsung pada akun Google pengguna. Jalankan uji operasional di spreadsheet percobaan terlebih dahulu.
- Cocokkan format buku dengan pedoman administrasi BPD yang berlaku sebelum digunakan sebagai arsip resmi.
