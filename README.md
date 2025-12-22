# Aplikasi WebGIS Potensi Usaha

Aplikasi WebGIS Potensi Usaha merupakan sistem berbasis web yang dirancang untuk membantu pengguna menganalisis potensi suatu lokasi usaha berdasarkan faktor spasial di sekitarnya. Aplikasi ini memanfaatkan data geografis untuk memberikan gambaran kuantitatif dan visual mengenai tingkat potensi lokasi yang diinput oleh pengguna.

Aplikasi ini dikembangkan sebagai bagian dari proyek akademik / skripsi pada bidang Sistem Informasi Geografis (SIG).

---

## 🎯 Tujuan Aplikasi

Tujuan utama dari aplikasi ini adalah:

* Memberikan **analisis potensi lokasi usaha** berbasis spasial
* Membantu pengambilan keputusan awal sebelum membuka usaha
* Menyajikan hasil analisis dalam bentuk peta interaktif dan skor potensi

---

## 🗺️ Konsep Analisis

Pengguna memasukkan titik lokasi rencana usaha, kemudian sistem akan melakukan analisis spasial berbasis buffer terhadap beberapa variabel, antara lain:

* Kompetitor (warung/usaha sejenis di sekitar lokasi)
* Pusat kegiatan (kantor, sekolah, fasilitas umum, dll)
* Kelas jalan (hirarki jalan berdasarkan OpenStreetMap)
* Aktivitas sekitar (aktivitas ekonomi dan sosial)

Setiap variabel diberi bobot dan skor, kemudian diakumulasi menjadi nilai potensi lokasi.

---

## 🧱 Arsitektur Sistem

Aplikasi ini dibangun menggunakan arsitektur single-page application (SPA) yang sepenuhnya berjalan di sisi client (frontend only) tanpa backend server.

* Seluruh data disimpan dalam bentuk file JSON statis
* Proses analisis spasial dan perhitungan skor dilakukan langsung di browser
* Tidak ada proses penyimpanan data ke server

---

## 📂 Struktur Repository

Struktur proyek frontend WebGIS saat ini adalah sebagai berikut:

```
src/
├── components/
│   ├── MapView.jsx        # Komponen peta interaktif (Leaflet)
│   ├── AnalysisPanel.jsx  # Panel analisis buffer & variabel
│   └── ScoreCard.jsx      # Tampilan skor potensi lokasi
│
├── data/
│   ├── competitors.json   # Data kompetitor/usaha sejenis
│   ├── activities.json    # Data pusat kegiatan & aktivitas
│   └── roads.json         # Data kelas jalan
│
├── utils/
│   ├── spatialAnalysis.js # Fungsi buffer & analisis spasial
│   └── scoring.js         # Perhitungan skor & pembobotan
│
├── App.jsx                # Root component aplikasi
└── main.jsx               # Entry point React
```

---

## 📊 Sumber Data

Data yang digunakan dalam aplikasi ini berasal dari:

* OpenStreetMap (OSM)
* Data hasil konversi PBF ke GeoJSON/JSON
* Data yang telah disederhanakan menjadi format:

```json
{
  "name": "Nama Lokasi",
  "category": "kategori",
  "lat": -7.82,
  "lon": 110.32
}
```

---

## 🚀 Deployment

Aplikasi ini menggunakan:

* GitHub sebagai version control
* CI/CD Pipeline untuk proses build dan deployment

### Skema Deployment:

* Frontend: GitHub Pages / GitLab Pages / Vercel
* Backend API: VPS (Nginx + PHP)
* Database: PostgreSQL

---

## 🧪 Status Pengembangan

* [x] Perancangan konsep dan metodologi
* [x] Penyusunan struktur data
* [x] Implementasi backend API
* [x] Implementasi frontend WebGIS
* [x] Integrasi analisis dan visualisasi skor potensi

---

## 📌 Catatan

Aplikasi ini bersifat pengambilan keputusan awal (decision support) dan tidak menggantikan studi kelayakan usaha secara menyeluruh.

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan akademik.

---

> Dikembangkan sebagai bagian dari eksplorasi penerapan WebGIS dalam analisis potensi lokasi usaha.
