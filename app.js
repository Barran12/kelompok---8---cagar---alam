/* =============================================
   WARISAN SUNDA — app.js
   CRUD: Create, Read, Update, Delete
   ============================================= */

/* ========== DATA MOCK ========== */
const SITUS_DATA = [
  {
    id: 1,
    nama: "Gedung Merdeka",
    kategori: "arsitektur",
    wilayah: "bandung",
    alamat: "Jl. Asia Afrika No. 65, Bandung",
    tahun: "1895",
    deskripsi: "Gedung bersejarah tempat berlangsungnya Konferensi Asia-Afrika 1955. Dibangun pada era kolonial Belanda dengan gaya arsitektur Art Deco yang khas, gedung ini menjadi simbol penting perlawanan terhadap kolonialisme dunia.",
    status: "Cagar Budaya Nasional",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Gedung_Merdeka.jpg/640px-Gedung_Merdeka.jpg",
    koordinat: [-6.9213, 107.6078],
  },
  {
    id: 2,
    nama: "Kawah Putih Ciwidey",
    kategori: "cagar-alam",
    wilayah: "bandung",
    alamat: "Ciwidey, Kabupaten Bandung",
    tahun: "Alam Purba",
    deskripsi: "Danau kawah vulkanik yang terbentuk dari aktivitas Gunung Patuha. Airnya berwarna hijau hingga putih susu karena kandungan belerang. Kawasan ini merupakan cagar alam yang dilindungi sekaligus destinasi wisata ilmiah.",
    status: "Cagar Alam Nasional",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kawah_putih_lake.jpg/640px-Kawah_putih_lake.jpg",
    koordinat: [-7.1663, 107.4007],
  },
  {
    id: 3,
    nama: "Situs Megalitikum Gunung Padang",
    kategori: "artefak",
    wilayah: "cianjur",
    alamat: "Karyamukti, Cianjur, Jawa Barat",
    tahun: "2000 SM (estimasi)",
    deskripsi: "Situs punden berundak terbesar di Asia Tenggara. Para peneliti memperkirakan situs ini berusia ribuan tahun dan merupakan peninggalan peradaban prasejarah Sunda. Masih aktif diteliti oleh arkeolog nasional dan internasional.",
    status: "Cagar Budaya Nasional",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Gunung_Padang_megalithic_site.jpg/640px-Gunung_Padang_megalithic_site.jpg",
    koordinat: [-6.9961, 107.0561],
  },
  {
    id: 4,
    nama: "Villa Isola (Bumi Siliwangi)",
    kategori: "arsitektur",
    wilayah: "bandung",
    alamat: "Jl. Setiabudhi No. 229, Bandung",
    tahun: "1933",
    deskripsi: "Bangunan bergaya Art Deco karya arsitek C.P. Wolff Schoemaker. Kini menjadi bagian dari kampus Universitas Pendidikan Indonesia. Sering disebut sebagai salah satu karya arsitektur modern terbaik di Indonesia.",
    status: "Cagar Budaya Provinsi",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Villa_isola.jpg/640px-Villa_isola.jpg",
    koordinat: [-6.8612, 107.5921],
  },
  {
    id: 5,
    nama: "Kebun Raya Bogor",
    kategori: "cagar-alam",
    wilayah: "bogor",
    alamat: "Jl. Ir. H. Juanda No. 13, Bogor",
    tahun: "1817",
    deskripsi: "Kebun raya tertua di Asia Tenggara yang didirikan pada masa pemerintahan Gubernur Jenderal Herman Willem Daendels. Menyimpan lebih dari 15.000 spesimen tumbuhan dari seluruh penjuru dunia dan menjadi pusat penelitian botani internasional.",
    status: "Cagar Alam & Warisan Budaya",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Bogor_Botanical_Garden.jpg/640px-Bogor_Botanical_Garden.jpg",
    koordinat: [-6.5973, 106.7996],
  },
  {
    id: 6,
    nama: "Masjid Agung Tasikmalaya",
    kategori: "arsitektur",
    wilayah: "tasikmalaya",
    alamat: "Alun-alun, Kota Tasikmalaya",
    tahun: "1832",
    deskripsi: "Masjid bersejarah di pusat kota Tasikmalaya yang telah berdiri sejak abad ke-19. Arsitekturnya memadukan gaya tradisional Sunda dengan sentuhan kolonial, mencerminkan perpaduan budaya yang khas pada masa itu.",
    status: "Cagar Budaya Kota",
    img: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=640&q=80",
    koordinat: [-7.3274, 108.2185],
  },
];

/* State aplikasi */
let submissions = JSON.parse(localStorage.getItem("ws_submissions") || "[]");
let editingId = null;
let katalogVisible = 6;
let activeCategory = "semua";
let activeWilayah = "semua";
let searchQuery = "";

/* ========== NAVBAR SCROLL ========== */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

/* ========== MOBILE NAV TOGGLE ========== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* ========== KATALOG RENDERING ========== */
function getFilteredData() {
  return SITUS_DATA.filter(s => {
    const matchCat = activeCategory === "semua" || s.kategori === activeCategory;
    const matchWil = activeWilayah === "semua" || s.wilayah === activeWilayah;
    const matchSearch = s.nama.toLowerCase().includes(searchQuery) ||
                        s.deskripsi.toLowerCase().includes(searchQuery) ||
                        s.alamat.toLowerCase().includes(searchQuery);
    return matchCat && matchWil && matchSearch;
  });
}

function getBadgeClass(kategori) {
  return { arsitektur: "badge-arsitektur", "cagar-alam": "badge-cagar-alam", artefak: "badge-artefak" }[kategori] || "badge-artefak";
}
function getKategoriLabel(k) {
  return { arsitektur: "Arsitektur", "cagar-alam": "Cagar Alam", artefak: "Artefak & Situs" }[k] || k;
}

function renderKatalog() {
  const grid = document.getElementById("katalogGrid");
  const empty = document.getElementById("katalogEmpty");
  const loadMore = document.getElementById("loadMoreBtn");
  const data = getFilteredData();

  grid.innerHTML = "";

  if (data.length === 0) {
    empty.classList.remove("hidden");
    loadMore.classList.add("hidden");
    return;
  }
  empty.classList.add("hidden");

  const visible = data.slice(0, katalogVisible);
  visible.forEach(situs => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = situs.id;
    card.innerHTML = `
      <img class="card-img" src="${situs.img}" alt="${situs.nama}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80'" />
      <div class="card-body">
        <span class="card-badge ${getBadgeClass(situs.kategori)}">${getKategoriLabel(situs.kategori)}</span>
        <h3 class="card-title">${situs.nama}</h3>
        <p class="card-meta">
          <span>📍 ${situs.alamat.split(",").slice(-2).join(",")} </span>
          <span>🗓 ${situs.tahun}</span>
        </p>
        <p class="card-desc">${situs.deskripsi}</p>
      </div>
      <div class="card-footer">
        <span class="card-status">⚑ ${situs.status}</span>
        <span class="card-link">Lihat Detail →</span>
      </div>
    `;
    card.addEventListener("click", () => openModal(situs));
    grid.appendChild(card);
  });

  loadMore.classList.toggle("hidden", katalogVisible >= data.length);
}

document.getElementById("loadMoreBtn").addEventListener("click", () => {
  katalogVisible += 3;
  renderKatalog();
});

/* ========== FILTER CHIPS ========== */
document.getElementById("filterCategory").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll("#filterCategory .chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  activeCategory = chip.dataset.filter;
  katalogVisible = 6;
  renderKatalog();
});

document.getElementById("filterWilayah").addEventListener("change", e => {
  activeWilayah = e.target.value;
  katalogVisible = 6;
  renderKatalog();
});

document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase().trim();
  katalogVisible = 6;
  renderKatalog();
});

/* ========== MODAL ========== */
const modalOverlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");

function openModal(situs) {
  modalBody.innerHTML = `
    <img class="modal-img" src="${situs.img}" alt="${situs.nama}"
         onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80'" />
    <span class="modal-badge card-badge ${getBadgeClass(situs.kategori)}">${getKategoriLabel(situs.kategori)}</span>
    <h2 class="modal-title">${situs.nama}</h2>
    <p class="modal-loc">📍 ${situs.alamat}</p>
    <p class="modal-desc">${situs.deskripsi}</p>
    <div class="modal-facts">
      <h4>Informasi Situs</h4>
      <div class="fact-row"><span class="fact-key">Tahun</span><span class="fact-val">${situs.tahun}</span></div>
      <div class="fact-row"><span class="fact-key">Kategori</span><span class="fact-val">${getKategoriLabel(situs.kategori)}</span></div>
      <div class="fact-row"><span class="fact-key">Status</span><span class="fact-val">${situs.status}</span></div>
      <div class="fact-row"><span class="fact-key">Wilayah</span><span class="fact-val">${situs.alamat.split(",").slice(-1)[0].trim()}</span></div>
    </div>
  `;
  modalOverlay.classList.add("open");
  modalOverlay.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ========== LEAFLET MAP ========== */
function initMap() {
  const map = L.map("map", { zoomControl: true }).setView([-7.0, 107.7], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  const colors = { arsitektur: "#8B5E3C", "cagar-alam": "#4A5240", artefak: "#2C1810" };

  SITUS_DATA.forEach(situs => {
    const marker = L.circleMarker(situs.koordinat, {
      radius: 10,
      fillColor: colors[situs.kategori] || "#8B5E3C",
      color: "#F5EFE6",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family:'Source Serif 4',serif; min-width:180px;">
        <strong style="font-family:'Playfair Display',serif; font-size:1rem; color:#2C1810;">${situs.nama}</strong>
        <br/><span style="font-size:0.78rem; color:#9E8E7E;">📍 ${situs.alamat.split(",").slice(-2).join(",")}</span>
        <br/><span style="font-size:0.78rem; color:#8B5E3C; font-weight:600;">${getKategoriLabel(situs.kategori)}</span>
      </div>
    `);
  });

  // Tambahkan marker submission yang sudah diverifikasi
  submissions
    .filter(s => s.statusVerifikasi === "diverifikasi")
    .forEach(s => {
      if (s.lat && s.lng) {
        L.circleMarker([s.lat, s.lng], {
          radius: 8,
          fillColor: "#C4A882",
          color: "#8B5E3C",
          weight: 2,
          fillOpacity: 0.7,
        }).addTo(map).bindPopup(`<strong>${s.namaSitus}</strong><br/><em>Usulan masyarakat</em>`);
      }
    });
}

/* ========== FORM VALIDATION & CRUD ========== */
function setError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (msg) {
    field.classList.add("invalid");
    err.textContent = msg;
    return false;
  } else {
    field.classList.remove("invalid");
    err.textContent = "";
    return true;
  }
}

function validateForm() {
  let valid = true;

  const nama = document.getElementById("namaSitus").value.trim();
  if (!setError("namaSitus", "errNamaSitus", !nama ? "Nama situs wajib diisi." : nama.length < 3 ? "Minimal 3 karakter." : "")) valid = false;

  const kat = document.getElementById("kategoriSitus").value;
  if (!setError("kategoriSitus", "errKategori", !kat ? "Pilih kategori situs." : "")) valid = false;

  const wil = document.getElementById("wilayahSitus").value.trim();
  if (!setError("wilayahSitus", "errWilayah", !wil ? "Wilayah wajib diisi." : "")) valid = false;

  const alamat = document.getElementById("alamatLengkap").value.trim();
  if (!setError("alamatLengkap", "errAlamat", !alamat ? "Alamat wajib diisi." : "")) valid = false;

  const desc = document.getElementById("deskripsiSitus").value.trim();
  if (!setError("deskripsiSitus", "errDeskripsi", !desc ? "Deskripsi wajib diisi." : desc.length < 20 ? "Minimal 20 karakter." : "")) valid = false;

  const namaPengaju = document.getElementById("namaPengaju").value.trim();
  if (!setError("namaPengaju", "errNamaPengaju", !namaPengaju ? "Nama pengaju wajib diisi." : "")) valid = false;

  const email = document.getElementById("emailPengaju").value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!setError("emailPengaju", "errEmail", !email ? "Email wajib diisi." : !emailRe.test(email) ? "Format email tidak valid." : "")) valid = false;

  const setuju = document.getElementById("setuju").checked;
  const errSetuju = document.getElementById("errSetuju");
  if (!setuju) {
    errSetuju.textContent = "Anda harus menyetujui pernyataan ini.";
    valid = false;
  } else {
    errSetuju.textContent = "";
  }

  return valid;
}

function getFormData() {
  return {
    id: editingId || Date.now(),
    namaSitus: document.getElementById("namaSitus").value.trim(),
    kategoriSitus: document.getElementById("kategoriSitus").value,
    wilayahSitus: document.getElementById("wilayahSitus").value.trim(),
    tahunEstimasi: document.getElementById("tahunEstimasi").value.trim(),
    alamatLengkap: document.getElementById("alamatLengkap").value.trim(),
    deskripsiSitus: document.getElementById("deskripsiSitus").value.trim(),
    namaPengaju: document.getElementById("namaPengaju").value.trim(),
    emailPengaju: document.getElementById("emailPengaju").value.trim(),
    statusPenetapan: document.getElementById("statusPenetapan").value,
    statusVerifikasi: "menunggu",
    tglAjukan: new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" }),
  };
}

function clearForm() {
  document.getElementById("ajukanForm").reset();
  document.getElementById("charCount").textContent = "0 / 500 karakter";
  document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
  document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
  editingId = null;
}

document.getElementById("ajukanForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const data = getFormData();

  if (editingId) {
    const idx = submissions.findIndex(s => s.id === editingId);
    if (idx !== -1) submissions[idx] = data;
    editingId = null;
  } else {
    submissions.push(data);
    document.getElementById("statSitus").textContent = SITUS_DATA.length + submissions.length;
  }

  localStorage.setItem("ws_submissions", JSON.stringify(submissions));
  renderSubmissionsTable();

  // Tampilkan sukses
  document.getElementById("successName").textContent = data.namaPengaju;
  document.getElementById("ajukanForm").classList.add("hidden");
  document.getElementById("formSuccess").classList.remove("hidden");
});

document.getElementById("resetForm").addEventListener("click", () => {
  clearForm();
  document.getElementById("ajukanForm").classList.remove("hidden");
  document.getElementById("formSuccess").classList.add("hidden");
});

/* ===== CHAR COUNT ===== */
document.getElementById("deskripsiSitus").addEventListener("input", function() {
  const len = this.value.length;
  document.getElementById("charCount").textContent = `${len} / 500 karakter`;
  if (len > 500) this.value = this.value.slice(0, 500);
});

/* ===== READ & RENDER TABLE ===== */
function renderSubmissionsTable() {
  const tbody = document.getElementById("submissionsBody");
  const empty = document.getElementById("tableEmpty");

  if (submissions.length === 0) {
    tbody.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  tbody.innerHTML = submissions.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${s.namaSitus}</strong></td>
      <td><span class="card-badge ${getBadgeClass(s.kategoriSitus)}">${getKategoriLabel(s.kategoriSitus)}</span></td>
      <td>${s.wilayahSitus}</td>
      <td>${s.namaPengaju}</td>
      <td><span class="status-badge status-${s.statusVerifikasi}">${s.statusVerifikasi === "menunggu" ? "Menunggu" : "Diverifikasi"}</span></td>
      <td>
        <button class="btn-edit btn-sm" onclick="editSubmission(${s.id})">Edit</button>
        <button class="btn-hapus btn-sm" onclick="deleteSubmission(${s.id})">Hapus</button>
      </td>
    </tr>
  `).join("");
}

/* ===== UPDATE ===== */
window.editSubmission = function(id) {
  const s = submissions.find(sub => sub.id === id);
  if (!s) return;

  editingId = id;
  document.getElementById("namaSitus").value = s.namaSitus;
  document.getElementById("kategoriSitus").value = s.kategoriSitus;
  document.getElementById("wilayahSitus").value = s.wilayahSitus;
  document.getElementById("tahunEstimasi").value = s.tahunEstimasi;
  document.getElementById("alamatLengkap").value = s.alamatLengkap;
  document.getElementById("deskripsiSitus").value = s.deskripsiSitus;
  document.getElementById("namaPengaju").value = s.namaPengaju;
  document.getElementById("emailPengaju").value = s.emailPengaju;
  document.getElementById("statusPenetapan").value = s.statusPenetapan || "";
  document.getElementById("setuju").checked = true;

  const descLen = s.deskripsiSitus.length;
  document.getElementById("charCount").textContent = `${descLen} / 500 karakter`;

  document.getElementById("ajukanForm").classList.remove("hidden");
  document.getElementById("formSuccess").classList.add("hidden");
  document.getElementById("ajukan").scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ===== DELETE ===== */
window.deleteSubmission = function(id) {
  if (!confirm("Yakin ingin menghapus usulan ini?")) return;
  submissions = submissions.filter(s => s.id !== id);
  localStorage.setItem("ws_submissions", JSON.stringify(submissions));
  document.getElementById("statSitus").textContent = SITUS_DATA.length + submissions.length;
  renderSubmissionsTable();
};

/* ========== INIT ========== */
document.addEventListener("DOMContentLoaded", () => {
  renderKatalog();
  renderSubmissionsTable();
  document.getElementById("statSitus").textContent = SITUS_DATA.length + submissions.length;
  initMap();
});
