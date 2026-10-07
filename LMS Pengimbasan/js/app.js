/* =========================================================
   app.js - Navigasi, animasi, Materi, dan Tugas
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const say = (el, text, ok) => { el.textContent = text; el.className = 'msg ' + (ok ? 'ok' : 'err'); };

/* ---------- Animasi muncul saat scroll ---------- */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
}), { threshold: .12 });
const observe = () => $$('.reveal:not(.show)').forEach(el => io.observe(el));

/* ---------- Navigasi antar halaman ---------- */
function go(id) {
  $$('.page').forEach(p => p.classList.toggle('on', p.id === id));
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

/* ---------- Materi ---------- */
async function loadMateri() {
  const box = $('#listMateri');
  if (!db) { box.innerHTML = '<p class="muted">Supabase belum dikonfigurasi (lihat js/config.js).</p>'; return; }
  const { data, error } = await db.from('materi').select('*').order('id');
  if (error || !data.length) { box.innerHTML = '<p class="muted">Belum ada materi.</p>'; return; }

  box.innerHTML = data.map(m => `
    <div class="mat">
      <div><b>${m.judul}</b><br><span class="badge">${(m.tipe || '').toUpperCase()}</span></div>
      <button class="btn ghost" data-url="${m.file_url}" data-tipe="${m.tipe}">Buka</button>
    </div>`).join('');

  $$('#listMateri .btn').forEach(b => b.onclick = () => {
    const v = $('#viewer'), url = b.dataset.url;
    v.src = b.dataset.tipe === 'pdf'
      ? url
      : 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(url);
    v.style.display = 'block';
    v.scrollIntoView({ behavior: 'smooth' });
  });
}

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
