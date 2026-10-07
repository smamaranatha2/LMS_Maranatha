-- =========================================================
-- Pembaruan v3: Postest dikunci & dibuka oleh admin
-- Jalankan SETELAH setup.sql dan admin.sql. Aman dijalankan berulang kali.
-- =========================================================

-- 1) Pengaturan (saklar postest)
create table if not exists pengaturan (
  kunci text primary key,
  nilai text not null
);
insert into pengaturan (kunci, nilai) values ('postest_aktif', 'false')
on conflict (kunci) do nothing;

alter table pengaturan enable row level security;
drop policy if exists "baca pengaturan" on pengaturan;
create policy "baca pengaturan" on pengaturan for select using (true);
drop policy if exists "admin ubah pengaturan" on pengaturan;
create policy "admin ubah pengaturan" on pengaturan
  for all to authenticated using (true) with check (true);

-- 2) Soal Postest (25 soal dari Materi 3, 4, 5)
--    Hanya bisa dibaca peserta saat postest_aktif = 'true'
create table if not exists soal_postest (
  no int primary key,
  pertanyaan text not null,
  opsi jsonb not null,
  jawaban int not null
);
alter table soal_postest enable row level security;
drop policy if exists "baca soal saat postest dibuka" on soal_postest;
create policy "baca soal saat postest dibuka" on soal_postest
  for select using (
    exists (select 1 from pengaturan where kunci = 'postest_aktif' and nilai = 'true')
  );

delete from soal_postest;
insert into soal_postest (no, pertanyaan, opsi, jawaban) values
  (1, 'Pembelajaran Mendalam menekankan suasana belajar yang...', '["Berkesadaran, bermakna, dan menggembirakan", "Kompetitif dan menegangkan", "Satu arah", "Berfokus pada hafalan"]', 0),
  (2, 'Tiga pengalaman belajar dalam Pembelajaran Mendalam adalah...', '["Mendengar, mencatat, menghafal", "Memahami, mengaplikasi, merefleksi", "Membaca, menulis, berhitung", "Mengamati, meniru, mengulang"]', 1),
  (3, 'Kerangka TPACK memiliki berapa domain pengetahuan?', '["Tiga", "Lima", "Tujuh", "Sembilan"]', 2),
  (4, 'Guru Fisika memakai simulasi PhET untuk menjelaskan hukum Newton. Domain TPACK-nya adalah...', '["PCK", "TCK", "TPK", "CK"]', 1),
  (5, 'Guru Bahasa Indonesia memakai Padlet untuk diskusi kolaboratif menulis teks. Domainnya adalah...', '["TPK", "CK", "PK", "TK"]', 0),
  (6, 'Urutan level TPACK dari terendah ke tertinggi adalah...', '["Exploring, Accepting, Adapting, Advancing", "Accepting, Adapting, Exploring, Advancing", "Advancing, Exploring, Adapting, Accepting", "Adapting, Accepting, Advancing, Exploring"]', 1),
  (7, 'Karakteristik MPI berupa umpan balik otomatis dan skor real-time disebut...', '["Non-linearitas", "Feedback langsung", "Integrasi multimedia", "Kendali guru"]', 1),
  (8, 'Constructive Alignment (Biggs) menekankan keselarasan antara...', '["Aktivitas pembelajaran, asesmen, dan capaian pembelajaran", "Jumlah murid dan jumlah buku", "Warna slide dan isi materi", "Jam pelajaran dan jam istirahat"]', 0),
  (9, 'Berpikir komputasional adalah...', '["Hanya belajar menulis kode", "Cara berpikir sistematis memecahkan masalah dengan prinsip ilmu komputer", "Menghafal bahasa pemrograman", "Menggunakan komputer tanpa berpikir"]', 1),
  (10, 'Memecah masalah besar menjadi bagian-bagian kecil disebut...', '["Abstraksi", "Dekomposisi", "Algoritma", "Pengenalan pola"]', 1),
  (11, 'Guru menemukan siswa lebih aktif saat bekerja kelompok dan memakai gambar. Ini penerapan...', '["Pengenalan pola", "Dekomposisi", "Halusinasi", "Plagiarisme"]', 0),
  (12, 'Menyederhanakan arus listrik dengan analogi aliran air di pipa merupakan contoh...', '["Algoritma", "Dekomposisi", "Abstraksi", "Bias"]', 2),
  (13, 'Algoritma adalah...', '["Kumpulan gambar", "Serangkaian langkah sistematis untuk menyelesaikan masalah", "Jenis perangkat keras", "Kesalahan program"]', 1),
  (14, 'Halusinasi pada KA berarti...', '["KA menghasilkan informasi tidak akurat atau fiktif", "KA bekerja sangat cepat", "KA kehabisan daya", "KA menolak semua perintah"]', 0),
  (15, 'Sikap bijak menggunakan KA adalah...', '["Menyalin langsung jawaban chatbot", "Memasukkan data pribadi sebanyak mungkin", "Selalu mengecek ulang kebenaran hasil keluaran KA", "Menjadikan KA rujukan tunggal"]', 2),
  (16, 'Prompt engineering adalah...', '["Teknik merancang instruksi agar output KA akurat dan relevan", "Memperbaiki perangkat keras", "Mengunduh aplikasi", "Membuat jaringan Wi-Fi"]', 0),
  (17, 'KA Generatif adalah KA yang mampu...', '["Hanya menganalisis data", "Menghasilkan konten baru seperti teks, gambar, atau suara", "Hanya menyimpan data", "Hanya mengoreksi ejaan"]', 1),
  (18, 'Empat komponen utama perencanaan pembelajaran mendalam adalah...', '["Identifikasi, Desain Pembelajaran, Pengalaman Belajar, Asesmen", "Tujuan, Materi, Ujian, Nilai", "Rencana, Biaya, Jadwal, Laporan", "Buku, Papan, Kapur, Meja"]', 0),
  (19, 'Alur tujuan pembelajaran adalah...', '["Tujuan pembelajaran yang diurutkan", "Daftar nama murid", "Jadwal piket guru", "Kumpulan soal ujian"]', 0),
  (20, 'Pada Flipped Classroom, murid...', '["Belajar materi secara mandiri sebelum kelas", "Hanya mendengarkan ceramah di kelas", "Berpindah antar stasiun", "Belajar hanya di laboratorium"]', 0),
  (21, 'Kelas terbagi ke beberapa stasiun dengan aktivitas berbeda, salah satunya memakai teknologi. Model ini adalah...', '["Lab Rotation", "Station Rotation", "Flipped Classroom", "Ceramah klasik"]', 1),
  (22, 'Pada Lab Rotation, murid...', '["Belajar hanya di rumah", "Berotasi dari kelas ke laboratorium komputer atau perangkat digital", "Mengerjakan soal tanpa perangkat", "Menunggu giliran di kantin"]', 1),
  (23, 'Prinsip pembelajaran bermakna berarti pembelajaran yang...', '["Kontekstual dan relevan dengan kehidupan nyata", "Hanya menghafal teori", "Bebas tanpa tujuan", "Tanpa interaksi"]', 0),
  (24, 'Asesmen pada awal pembelajaran bertujuan mengetahui...', '["Nilai akhir semester", "Kesiapan belajar, pengetahuan awal, dan kebutuhan murid", "Daftar kehadiran guru", "Anggaran sekolah"]', 1),
  (25, 'Observasi, refleksi, dan kuis selama pembelajaran termasuk asesmen...', '["Awal pembelajaran", "Selama proses pembelajaran", "Akhir pembelajaran", "Akhir tahun"]', 1);

-- 3) Skor Postest hanya bisa disimpan saat postest dibuka
drop policy if exists "simpan skor" on hasil_tes;
create policy "simpan skor" on hasil_tes
  for insert with check (
    jenis <> 'Postest'
    or exists (select 1 from pengaturan where kunci = 'postest_aktif' and nilai = 'true')
  );
