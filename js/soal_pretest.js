/* soal_pretest.js - 25 soal Pretest dari Materi 1 (Paradigma Pembelajaran) dan Materi 2 (Perangkat Digital)
   a = nomor jawaban benar (mulai dari 0) */
const SOAL_PRETEST = [
  {"q": "Tren hasil PISA Indonesia dari 2015 ke 2022 cenderung...", "o": ["Meningkat tajam", "Menurun", "Tidak berubah", "Tidak pernah diukur"], "a": 1},
  {"q": "Salah satu poin Instruksi Presiden No 7 Tahun 2025 adalah...", "o": ["Menghapus ujian nasional", "Mempercepat pelaksanaan digitalisasi pembelajaran", "Mengurangi jam pelajaran", "Menutup sekolah kecil"], "a": 1},
  {"q": "Tiga pilar utama ekosistem digitalisasi pembelajaran adalah...", "o": ["Guru, siswa, orang tua", "Technology, Environment, Process", "Input, Output, Storage", "Materi, Tugas, Ujian"], "a": 1},
  {"q": "Pilar Environment dalam ekosistem digital berarti...", "o": ["Perangkat keras dan jaringan", "Ruang belajar fleksibel yang mendukung integrasi teknologi", "Metode pembelajaran satu arah", "Konten digital berbayar"], "a": 1},
  {"q": "Smart Evaluation pada elemen pendukung ekosistem adalah...", "o": ["Asesmen berbasis teknologi yang komprehensif dan langsung", "Penataan meja kelas", "Materi digital interaktif", "Rapat guru bulanan"], "a": 0},
  {"q": "Paradigma pembelajaran digital merupakan...", "o": ["Pergantian buku cetak menjadi file PDF", "Pergeseran mendasar cara pengetahuan dikonstruksi, didistribusikan, dan dinilai", "Pemindahan papan tulis ke layar proyektor", "Penambahan jumlah perangkat saja"], "a": 1},
  {"q": "Pada paradigma baru, perangkat digital diposisikan sebagai...", "o": ["Alat presentasi guru", "Hiburan di sela belajar", "Mitra intelektual siswa (cognitive tools)", "Pengganti guru"], "a": 2},
  {"q": "Menurut Konektivisme (Siemens, 2005), pengetahuan di era digital...", "o": ["Hanya ada di buku teks", "Hanya dimiliki guru", "Tersebar dalam network informasi", "Tidak bisa dibagikan"], "a": 2},
  {"q": "Siswa memanipulasi balok virtual di PID untuk memahami pembilang dan penyebut. Ini contoh...", "o": ["Teknologi sebagai cognitive tools", "Menonton video secara pasif", "Ceramah satu arah", "Kuis hafalan"], "a": 0},
  {"q": "Dalam self-paced learning, siswa...", "o": ["Mengikuti kecepatan guru", "Mengendalikan kecepatan belajarnya sendiri", "Belajar tanpa materi", "Hanya belajar berkelompok"], "a": 1},
  {"q": "Kekhawatiran dalam pemanfaatan teknologi pendidikan antara lain...", "o": ["Cyber bullying dan informasi palsu", "Terlalu banyak buku", "Ruang kelas terlalu luas", "Jam belajar terlalu singkat"], "a": 0},
  {"q": "Salah satu Program Kemendikdasmen 2024-2029 adalah...", "o": ["Pembelajaran Koding dan Kecerdasan Artifisial", "Penghapusan kurikulum", "Pembatasan akses internet", "Pengurangan jumlah guru"], "a": 0},
  {"q": "Numerasi baru dalam paradigma digital berarti kemampuan...", "o": ["Menghafal rumus", "Menerjemahkan fenomena nyata menjadi representasi data digital", "Menghitung tanpa alat", "Menyalin tabel"], "a": 1},
  {"q": "Perangkat digital pembelajaran digunakan untuk...", "o": ["Mengakses, menampilkan, mengolah, menyimpan, dan membagikan informasi", "Hanya mencetak dokumen", "Hanya hiburan", "Hanya menyimpan arsip fisik"], "a": 0},
  {"q": "Router dan access point Wi-Fi termasuk kategori...", "o": ["Audio dan multimedia", "Jaringan dan konektivitas internet", "Penyimpanan data", "Perangkat cetak"], "a": 1},
  {"q": "Hardisk eksternal, SSD, dan flashdisk termasuk kategori...", "o": ["Perangkat keamanan", "Perangkat tampilan", "Penyimpanan data dan backup", "Perekaman konten"], "a": 2},
  {"q": "Speaker aktif dan mikrofon termasuk kategori...", "o": ["Audio dan pendukung multimedia", "Jaringan", "Cetak dan pindai", "Komputasi"], "a": 0},
  {"q": "Fitur privasi kamera pada PID yang dibahas adalah...", "o": ["Penutup fisik dan lampu indikator", "Kata sandi layar", "Kamera tersembunyi", "Perekaman otomatis"], "a": 0},
  {"q": "Fungsi utama PID dalam pembelajaran adalah...", "o": ["Menulis, menganotasi, dan menampilkan bahan ajar langsung di layar", "Hanya memutar musik", "Menggantikan laptop sepenuhnya", "Mencetak soal"], "a": 0},
  {"q": "Tiga aspek pengelolaan perangkat digital adalah...", "o": ["Beli, jual, hapus", "Inventarisasi, penggunaan dan pemanfaatan, perawatan dan pemeliharaan", "Instal, update, reset", "Pinjam, kembalikan, lupakan"], "a": 1},
  {"q": "Data yang dicatat saat inventarisasi unit mencakup...", "o": ["Nama barang, kode/nomor seri, kondisi, lokasi, penanggung jawab", "Hanya harga", "Hanya warna", "Hanya nama pembeli"], "a": 0},
  {"q": "Preventive maintenance adalah...", "o": ["Perbaikan setelah rusak", "Pemeriksaan dan perawatan rutin untuk mencegah kerusakan", "Membuang perangkat lama", "Menunggu perangkat error"], "a": 1},
  {"q": "Pengujian fungsi kabel dan port HDMI/USB dilakukan...", "o": ["Setiap hari", "Setiap minggu", "Setiap semester", "Setiap tahun"], "a": 1},
  {"q": "Cara membersihkan layar PID yang benar adalah...", "o": ["Semprot cairan langsung ke layar", "Matikan perangkat, lalu gunakan kain microfiber lembut dan kering", "Gunakan tisu kasar", "Gunakan amonia pekat"], "a": 1},
  {"q": "Saat terjadi badai petir, PID sebaiknya...", "o": ["Tetap menyala", "Dimatikan dan kabel power dicabut", "Dipindahkan ke luar", "Dihubungkan ke banyak perangkat"], "a": 1}
];
