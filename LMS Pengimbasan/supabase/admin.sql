-- =========================================================
-- Hak akses ADMIN (pengguna yang sudah login / role "authenticated")
-- Jalankan SETELAH setup.sql. Aman dijalankan berulang kali.
-- =========================================================

-- Materi: admin boleh tambah, ubah, hapus (baca sudah publik dari setup.sql)
drop policy if exists "admin kelola materi" on materi;
create policy "admin kelola materi" on materi
  for all to authenticated using (true) with check (true);

-- Tugas & hasil tes: admin boleh membaca
drop policy if exists "admin baca tugas" on tugas;
create policy "admin baca tugas" on tugas
  for select to authenticated using (true);

drop policy if exists "admin baca skor" on hasil_tes;
create policy "admin baca skor" on hasil_tes
  for select to authenticated using (true);

-- Storage: admin unggah & hapus file materi
drop policy if exists "admin unggah materi" on storage.objects;
create policy "admin unggah materi" on storage.objects
  for insert to authenticated with check (bucket_id = 'materi');

drop policy if exists "admin hapus materi" on storage.objects;
create policy "admin hapus materi" on storage.objects
  for delete to authenticated using (bucket_id = 'materi');

-- Storage: admin boleh mengunduh file tugas (bucket privat)
drop policy if exists "admin baca file tugas" on storage.objects;
create policy "admin baca file tugas" on storage.objects
  for select to authenticated using (bucket_id = 'tugas');
