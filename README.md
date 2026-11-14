# Website Service AC (static)

HTML + CSS + JS biasa, tanpa build. Cocok untuk GitHub + Vercel. Responsif di HP, tablet, dan desktop.

## Mengubah isi
1. **Nama, WhatsApp, alamat, jam, email, Instagram, angka statistik, Google Maps** → `content.js`
2. **Layanan, harga, FAQ, area, merek AC, cerita bisnis** → `index.html` (cari komentar `EDIT:`)
3. **Judul & deskripsi Google** → bagian `<head>` di `index.html`
4. **Warna** → variabel `:root` (mode terang) dan `[data-theme="dark"]` (mode gelap) di `style.css`

Format WhatsApp: `62812...` (tanpa `+`, tanpa `0` di depan).

## Mode gelap
Otomatis mengikuti pengaturan perangkat pengunjung. Tombol bulan/matahari di header membiarkan pengunjung memilih sendiri, dan pilihannya diingat di browser mereka.
Peta Google Maps tetap tampil terang (tidak bisa diubah dari website).

## Foto
Taruh di folder `images/` dengan nama seperti di `images/LIHAT-README.txt`.
Foto yang belum ada tampil sebagai kotak kosong. Foto galeri bisa diklik untuk diperbesar.
Mau menambah slot galeri? Salin satu baris `<figure class="ph" ...>` di bagian GALERI pada `index.html`.

## Ulasan Google Maps
Tanpa pengaturan apa pun, bagian ulasan menampilkan tombol **Baca semua ulasan** dan **Tulis ulasan** yang membuka Google Maps.
1. Isi `googlePlaceId` di `content.js` agar tombol langsung menuju profil bisnis Anda.
2. (Opsional) Tampilkan rating dan kutipan ulasan langsung di website:
   - Buat API key di Google Cloud Console, aktifkan **Places API (New)**, dan batasi key tersebut ke API itu saja.
   - Di Vercel: Project → Settings → Environment Variables, tambahkan `GOOGLE_MAPS_API_KEY` dan `GOOGLE_PLACE_ID`, lalu Redeploy.
   - Google hanya memberi sampai 5 ulasan per permintaan, dan hasil disimpan (cache) 24 jam.
   - Fitur ini hanya jalan setelah deploy di Vercel, bukan saat file dibuka langsung dari komputer.

## Deploy
1. Upload semua file ke repository GitHub.
2. Vercel → Add New → Project → Import repository.
3. Framework Preset: **Other**. Kosongkan Build Command dan Output Directory. Deploy.
4. Domain sendiri: Project → Settings → Domains.
