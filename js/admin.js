/* =========================================================
   admin.js - Login admin (Supabase Auth) & kelola materi
   Membutuhkan: js/config.js (objek CONFIG dan klien db)
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const say = (el, text, ok) => { el.textContent = text; el.className = 'msg ' + (ok ? 'ok' : 'err'); };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tgl = d => new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

/* ---------- Tampilan login / dashboard ---------- */
let lastUser = null;
function render(session) {
  $('#loginView').classList.toggle('hidden', !!session);
  $('#dashView').classList.toggle('hidden', !session);
  $('#btnLogout').classList.toggle('hidden', !session);
  const uid = session ? session.user.id : null;
  if (uid === lastUser) return;          // hindari muat ulang berulang
  lastUser = uid;
  if (session) {
    $('#adminEmail').textContent = session.user.email;
    loadMateri(); loadTugas(); loadHasil(); loadPostest();
  }
}

async function init() {
  if (!db) { say($('#lMsg'), 'Supabase belum dikonfigurasi. Isi js/config.js terlebih dahulu.'); return; }
  const { data } = await db.auth.getSession();
  render(data.session);
  db.auth.onAuthStateChange((_e, s) => render(s));
}

/* ---------- Login & logout ---------- */
$('#formLogin').onsubmit = async e => {
  e.preventDefault();
  const m = $('#lMsg');
  if (!db) return say(m, 'Supabase belum dikonfigurasi.');
  const email = $('#email').value.trim(), password = $('#password').value;
  if (!email || !password) return say(m, 'Isi email dan password.');
  say(m, 'Memeriksa...', true);
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) return say(m, 'Login gagal: email atau password salah.');
  m.className = 'msg'; $('#password').value = '';
};
$('#btnLogout').onclick = async () => { await db.auth.signOut(); lastUser = null; render(null); };

/* ---------- Tab ---------- */
$$('.tab').forEach(t => t.onclick = () => {
  $$('.tab').forEach(x => x.classList.toggle('on', x === t));
  $$('.panel').forEach(p => p.classList.toggle('on', p.id === t.dataset.tab));
});

/* ---------- Materi: unggah ---------- */
$('#formMateri').onsubmit = async e => {
  e.preventDefault();
  const m = $('#mMsg'), judul = $('#mJudul').value.trim(), f = $('#mFile').files[0];
  if (!judul || !f) return say(m, 'Isi judul dan pilih file.');
  const ext = f.name.split('.').pop().toLowerCase();
  if (!CONFIG.EXT_TUGAS.includes(ext)) return say(m, 'Format harus PDF, PPT/PPTX, atau DOC/DOCX.');
  if (f.size > CONFIG.MAX_MATERI_MB * 1024 * 1024) return say(m, `Ukuran file maksimal ${CONFIG.MAX_MATERI_MB} MB.`);

  say(m, 'Mengunggah...', true);
  const path = Date.now() + '_' + f.name.replace(/[^\w.\-]+/g, '_');
  const up = await db.storage.from(CONFIG.BUCKET_MATERI).upload(path, f);
  if (up.error) return say(m, 'Gagal mengunggah: ' + up.error.message);

  const { data } = db.storage.from(CONFIG.BUCKET_MATERI).getPublicUrl(path);
  const { error } = await db.from('materi').insert({ judul, tipe: ext, file_url: data.publicUrl });
  if (error) return say(m, 'Gagal menyimpan data: ' + error.message);

  say(m, 'Materi berhasil diunggah dan sudah tampil di website.', true);
  e.target.reset(); loadMateri();
};

/* ---------- Materi: daftar & hapus ---------- */
async function loadMateri() {
  const box = $('#listMateri');
  const { data, error } = await db.from('materi').select('*').order('id', { ascending: false });
  if (error) { box.innerHTML = `<p class="muted">Gagal memuat: ${esc(error.message)}</p>`; return; }
  if (!data.length) { box.innerHTML = '<p class="muted">Belum ada materi.</p>'; return; }
  box.innerHTML = '<div class="scroll-x"><table class="tbl"><thead><tr><th>Judul</th><th>Tipe</th><th></th></tr></thead><tbody>' +
    data.map(r => `<tr><td>${esc(r.judul)}</td><td><span class="badge">${esc(r.tipe).toUpperCase()}</span></td>
      <td style="text-align:right;white-space:nowrap">
        <a class="btn ghost sm" href="${esc(r.file_url)}" target="_blank" rel="noopener">Lihat</a>
        <button class="btn danger sm" data-del="${r.id}" data-url="${esc(r.file_url)}">Hapus</button></td></tr>`).join('') +
    '</tbody></table></div>';
  $$('[data-del]').forEach(b => b.onclick = () => hapusMateri(b.dataset.del, b.dataset.url));
}

async function hapusMateri(id, url) {
  if (!confirm('Hapus materi ini? Tindakan tidak bisa dibatalkan.')) return;
  const marker = `/object/public/${CONFIG.BUCKET_MATERI}/`;
  const i = url.indexOf(marker);
  if (i > -1) await db.storage.from(CONFIG.BUCKET_MATERI).remove([decodeURIComponent(url.slice(i + marker.length))]);
  const { error } = await db.from('materi').delete().eq('id', id);
  if (error) alert('Gagal menghapus: ' + error.message);
  loadMateri();
}

/* ---------- Tugas masuk ---------- */
async function loadTugas() {
  const box = $('#listTugas');
  const { data, error } = await db.from('tugas').select('*').order('dibuat', { ascending: false }).limit(200);
  if (error) { box.innerHTML = `<p class="muted">Gagal memuat: ${esc(error.message)}</p>`; return; }
  if (!data.length) { box.innerHTML = '<p class="muted">Belum ada tugas masuk.</p>'; return; }
  box.innerHTML = '<div class="scroll-x"><table class="tbl"><thead><tr><th>Nama</th><th>File</th><th>Waktu</th><th></th></tr></thead><tbody>' +
    data.map(r => `<tr><td>${esc(r.nama)}</td><td>${esc(r.nama_file)}</td><td>${tgl(r.dibuat)}</td>
      <td style="text-align:right"><button class="btn ghost sm" data-path="${esc(r.path)}" data-name="${esc(r.nama_file)}">Unduh</button></td></tr>`).join('') +
    '</tbody></table></div>';
  $$('[data-path]').forEach(b => b.onclick = async () => {
    const { data: d, error: er } = await db.storage.from(CONFIG.BUCKET_TUGAS).createSignedUrl(b.dataset.path, 60, { download: b.dataset.name });
    if (er) return alert('Gagal: ' + er.message);
    const a = document.createElement('a'); a.href = d.signedUrl; a.click();
  });
}

/* ---------- Hasil tes ---------- */
async function loadHasil() {
  const box = $('#listHasil');
  const { data, error } = await db.from('hasil_tes').select('*').order('dibuat', { ascending: false }).limit(200);
  if (error) { box.innerHTML = `<p class="muted">Gagal memuat: ${esc(error.message)}</p>`; return; }
  if (!data.length) { box.innerHTML = '<p class="muted">Belum ada hasil tes.</p>'; return; }
  box.innerHTML = '<div class="scroll-x"><table class="tbl"><thead><tr><th>Nama</th><th>Jenis</th><th>Skor</th><th>Waktu</th></tr></thead><tbody>' +
    data.map(r => `<tr><td>${esc(r.nama)}</td><td>${esc(r.jenis)}</td><td><b>${r.skor}</b></td><td>${tgl(r.dibuat)}</td></tr>`).join('') +
    '</tbody></table></div>';
}

init();

/* ---------- Saklar Postest ---------- */
async function loadPostest() {
  const { data, error } = await db.from('pengaturan').select('nilai').eq('kunci', 'postest_aktif').maybeSingle();
  const b = $('#btnTogglePostest'), m = $('#pMsgPostest');
  const aktif = !error && !!data && data.nilai === 'true';
  $('#statusPostest').textContent = error ? 'GALAT' : (aktif ? 'DIBUKA' : 'DITUTUP');
  if (error) say(m, 'Gagal membaca pengaturan: ' + error.message + '. Pastikan update_v3.sql sudah dijalankan.');
  b.textContent = aktif ? 'Tutup Postest' : 'Buka Postest';
  b.className = 'btn ' + (aktif ? 'danger' : 'sage');
  b.dataset.aktif = aktif ? '1' : '0';
}
$('#btnTogglePostest').onclick = async () => {
  const b = $('#btnTogglePostest'), m = $('#pMsgPostest'), buka = b.dataset.aktif !== '1';
  const { error } = await db.from('pengaturan').upsert({ kunci: 'postest_aktif', nilai: buka ? 'true' : 'false' });
  if (error) return say(m, 'Gagal mengubah: ' + error.message);
  say(m, buka ? 'Postest dibuka. Peserta kini bisa mengerjakan.' : 'Postest ditutup.', true);
  loadPostest();
};
