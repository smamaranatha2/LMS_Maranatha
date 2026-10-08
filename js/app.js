/* =========================================================
   app.js - Navigasi, animasi, Materi, dan Tugas
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const say = (el, text, ok) => { el.textContent = text; el.className = 'msg ' + (ok ? 'ok' : 'err'); };

/* ---------- Animasi muncul saat scroll ---------- */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
}), { threshold: 0, rootMargin: '0px 0px -6% 0px' });   // threshold 0: elemen setinggi apa pun tetap muncul
const observe = () => $$('.reveal:not(.show)').forEach(el => io.observe(el));

/* ---------- Navigasi antar halaman ---------- */
function go(id) {
  const sama = $('#' + id).classList.contains('on');       // sudah di halaman ini?
  $$('.page').forEach(p => p.classList.toggle('on', p.id === id));
  // putar ulang animasi naik setiap halaman dibuka kembali (termasuk Beranda & Lokasi)
  if (!sama) $$('#' + id + ' .reveal, #lokasi .reveal').forEach(el => el.classList.remove('show'));
  $$('nav a').forEach(a => a.classList.toggle('on', a.dataset.go === id));
  tutupMenu();
  $('#lokasi').style.display = id === 'beranda' ? '' : 'none';   // peta hanya di beranda
  if (id === 'postest' && typeof cekPostest === 'function') cekPostest();
  window.scrollTo({ top: 0 });
  observe();
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) go(g.dataset.go);
});
function tutupMenu() {
  $('#nav').classList.remove('open');
  $('#burger').classList.remove('open');
  $('#backdrop').classList.remove('show');
}
$('#burger').onclick = () => {
  const buka = $('#nav').classList.toggle('open');
  $('#burger').classList.toggle('open', buka);
  $('#backdrop').classList.toggle('show', buka);
};
$('#backdrop').onclick = tutupMenu;
document.addEventListener('keydown', e => { if (e.key === 'Escape') tutupMenu(); });

/* ---------- Materi: penampil Google Viewer, layar penuh, unduh ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const namaFile = (judul, tipe) => String(judul).replace(/[\\/:*?"<>|]+/g, '').trim() + '.' + tipe;
// Supabase Storage: parameter ?download=nama membuat browser menyimpan file ke perangkat
const urlUnduh = (url, nama) => url + (url.includes('?') ? '&' : '?') + 'download=' + encodeURIComponent(nama);
const urlGoogle = (url, embed) => 'https://docs.google.com/gview?' + (embed ? 'embedded=true&' : '') + 'url=' + encodeURIComponent(url);

async function loadMateri() {
  const box = $('#listMateri');
  if (!db) { box.innerHTML = '<p class="muted">Supabase belum dikonfigurasi (lihat js/config.js).</p>'; return; }
  const { data, error } = await db.from('materi').select('*').order('id');
  if (error) { box.innerHTML = `<p class="muted">Gagal memuat materi: ${esc(error.message)}</p>`; return; }
  if (!data.length) { box.innerHTML = '<p class="muted">Belum ada materi.</p>'; return; }

  box.innerHTML = data.map(m => {
    const tipe = m.tipe || 'pdf', nama = namaFile(m.judul, tipe);
    return `<div class="mat">
      <div><b>${esc(m.judul)}</b><br><span class="badge">${esc(tipe).toUpperCase()}</span></div>
      <div class="aksi">
        <button class="btn ghost sm" data-url="${esc(m.file_url)}" data-judul="${esc(m.judul)}" data-tipe="${esc(tipe)}">Buka</button>
        <a class="btn sm" href="${esc(urlUnduh(m.file_url, nama))}" download="${esc(nama)}">Unduh</a>
      </div></div>`;
  }).join('');
  $$('#listMateri button[data-url]').forEach(b => b.onclick = () => bukaMateri(b));
}

function bukaMateri(b) {
  const url = b.dataset.url, nama = namaFile(b.dataset.judul, b.dataset.tipe), wrap = $('#penampil');
  $('#penampilJudul').textContent = b.dataset.judul;
  $('#viewer').src = urlGoogle(url, true);
  $('#btnUnduh').href = urlUnduh(url, nama);
  $('#btnUnduh').setAttribute('download', nama);
  $('#btnTab').href = urlGoogle(url, false);
  wrap.classList.remove('hidden');
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Layar penuh (cadangan kelas .penuh untuk browser tanpa Fullscreen API, mis. iPhone) */
const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
const layarPenuhAktif = () => !!fsEl() || $('#penampil').classList.contains('penuh');
function sinkronLayarPenuh() {
  $('#btnLayarPenuh').textContent = layarPenuhAktif() ? 'Keluar Layar Penuh' : 'Layar Penuh';
  document.body.style.overflow = $('#penampil').classList.contains('penuh') ? 'hidden' : '';
}
$('#btnLayarPenuh').onclick = () => {
  const wrap = $('#penampil');
  if (layarPenuhAktif()) {
    if (fsEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    wrap.classList.remove('penuh');
  } else {
    const req = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
    if (req) {
      const r = req.call(wrap);
      if (r && r.catch) r.catch(() => { wrap.classList.add('penuh'); sinkronLayarPenuh(); });
    } else wrap.classList.add('penuh');
  }
  sinkronLayarPenuh();
};
['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, sinkronLayarPenuh));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#penampil').classList.contains('penuh')) { $('#penampil').classList.remove('penuh'); sinkronLayarPenuh(); }
});

/* ---------- Tugas (tanpa login) ---------- */
$('#btnKirim').onclick = async () => {
  const nama = $('#tNama').value.trim(), f = $('#tFile').files[0], m = $('#tMsg');
  if (!db) return say(m, 'Supabase belum dikonfigurasi.');
  if (!nama || !f) return say(m, 'Isi nama dan pilih file terlebih dahulu.');

  const ext = f.name.split('.').pop().toLowerCase();
  if (!CONFIG.EXT_TUGAS.includes(ext)) return say(m, 'Format harus PDF, PPT, atau Word.');
  if (f.size > CONFIG.MAX_FILE_MB * 1024 * 1024) return say(m, `Ukuran file maksimal ${CONFIG.MAX_FILE_MB} MB.`);

  say(m, 'Mengunggah...', true);
  const path = Date.now() + '_' + nama.replace(/\W+/g, '_') + '.' + ext;
  const up = await db.storage.from(CONFIG.BUCKET_TUGAS).upload(path, f);
  if (up.error) return say(m, 'Gagal mengunggah: ' + up.error.message);

  const { error } = await db.from('tugas').insert({ nama, nama_file: f.name, path });
  if (error) return say(m, 'Gagal menyimpan: ' + error.message);
  say(m, 'Tugas berhasil dikirim. Terima kasih!', true);
  $('#tFile').value = '';
};

loadMateri();
observe();
