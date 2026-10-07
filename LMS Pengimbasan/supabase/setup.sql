-- =========================================================
-- Setup database LMS Digitalisasi Pembelajaran
-- Jalankan di Supabase > SQL Editor > New query > Run
-- =========================================================

-- Tabel
create table if not exists materi (
  id serial primary key,
  judul text not null,
  tipe text not null,          -- pdf | pptx | docx
  file_url text not null       -- Public URL dari bucket "materi"
);

create table if not exists tugas (
  id serial primary key,
  nama text not null,
  nama_file text,
  path text,
  dibuat timestamptz default now()
);

create table if not exists hasil_tes (
  id serial primary key,
  nama text not null,
  jenis text not null,         -- Pretest | Postest
  skor int not null,
  dibuat timestamptz default now()
);

-- Keamanan (Row Level Security)
alter table materi enable row level security;
alter table tugas enable row level security;
alter table hasil_tes enable row level security;

create policy "baca materi" on materi for select using (true);
create policy "kirim tugas" on tugas for insert with check (true);
create policy "simpan skor" on hasil_tes for insert with check (true);

-- Storage: materi (publik) dan tugas (privat, hanya bisa diunggah)
insert into storage.buckets (id, name, public)
values ('materi', 'materi', true), ('tugas', 'tugas', false)
on conflict (id) do nothing;

create policy "unggah tugas" on storage.objects
  for insert to anon with check (bucket_id = 'tugas');
