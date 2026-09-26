const state = {
  page: 1,
  limit: 5,
  search: '',
  kelas: '',
  totalPages: 1,
  editingId: null,
  deleteTargetId: null,
};

const el = {
  tableBody: document.getElementById('siswaTableBody'),
  emptyState: document.getElementById('emptyState'),
  pagination: document.getElementById('paginationContainer'),
  searchInput: document.getElementById('searchInput'),
  filterKelas: document.getElementById('filterKelas'),
  btnTambah: document.getElementById('btnTambah'),
  loadingOverlay: document.getElementById('loadingOverlay'),
  toastContainer: document.getElementById('toastContainer'),
  formModal: document.getElementById('formModal'),
  formModalTitle: document.getElementById('formModalTitle'),
  siswaForm: document.getElementById('siswaForm'),
  siswaId: document.getElementById('siswaId'),
  closeFormModal: document.getElementById('closeFormModal'),
  cancelFormBtn: document.getElementById('cancelFormBtn'),
  submitFormBtn: document.getElementById('submitFormBtn'),
  deleteModal: document.getElementById('deleteModal'),
  deleteSiswaName: document.getElementById('deleteSiswaName'),
  closeDeleteModal: document.getElementById('closeDeleteModal'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
  darkModeToggle: document.getElementById('darkModeToggle'),
};

const inputs = {
  nis: document.getElementById('nis'),
  nama: document.getElementById('nama'),
  kelas: document.getElementById('kelas'),
  jurusan: document.getElementById('jurusan'),
  alamat: document.getElementById('alamat'),
  foto: document.getElementById('foto'),
};

function showLoading() { el.loadingOverlay.classList.remove('hidden'); }
function hideLoading() { el.loadingOverlay.classList.add('hidden'); }

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  el.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function clearFieldErrors() {
  ['nis', 'nama', 'kelas', 'jurusan', 'alamat'].forEach((f) => {
    const errEl = document.getElementById(`error-${f}`);
    if (errEl) errEl.textContent = '';
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let debounceTimer;
function debounce(fn, delay = 400) {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn(...args), delay);
  };
}

function renderTable(data) {
  el.tableBody.innerHTML = '';
  if (!data || data.length === 0) {
    el.emptyState.classList.remove('hidden');
    return;
  }
  el.emptyState.classList.add('hidden');

  data.forEach((siswa) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${siswa.id}</td>
      <td>${siswa.foto ? `<img class="foto-thumb" src="${siswa.foto}" alt="Foto" />` : `<div class="foto-thumb"></div>`}</td>
      <td>${escapeHtml(siswa.nis)}</td>
      <td>${escapeHtml(siswa.nama)}</td>
      <td>${escapeHtml(siswa.kelas)}</td>
      <td>${escapeHtml(siswa.jurusan)}</td>
      <td>${escapeHtml(siswa.alamat)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${siswa.id}">Edit</button>
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${siswa.id}" data-nama="${escapeHtml(siswa.nama)}">Hapus</button>
      </td>
    `;
    el.tableBody.appendChild(tr);
  });
}

function renderPagination(meta) {
  el.pagination.innerHTML = '';
  if (!meta || meta.totalPages <= 1) return;
  const { page, totalPages } = meta;
  state.totalPages = totalPages;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '‹ Prev';
  prevBtn.disabled = page <= 1;
  prevBtn.onclick = () => goToPage(page - 1);
  el.pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === page) btn.classList.add('active');
    btn.onclick = () => goToPage(i);
    el.pagination.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next ›';
  nextBtn.disabled = page >= totalPages;
  nextBtn.onclick = () => goToPage(page + 1);
  el.pagination.appendChild(nextBtn);
}

function updateKelasFilterOptions(data) {
  const existingValues = Array.from(el.filterKelas.options).map((o) => o.value);
  const kelasSet = new Set(data.map((s) => s.kelas));
  kelasSet.forEach((kelas) => {
    if (!existingValues.includes(kelas)) {
      const opt = document.createElement('option');
      opt.value = kelas;
      opt.textContent = kelas;
      el.filterKelas.appendChild(opt);
    }
  });
}

async function loadSiswa() {
  showLoading();
  try {
    const res = await fetchSiswaList({ search: state.search, kelas: state.kelas, page: state.page, limit: state.limit });
    renderTable(res.data);
    renderPagination(res.meta);
    updateKelasFilterOptions(res.data);
  } catch (err) {
    showToast(err.message || 'Gagal mengambil data siswa dari API.', 'error');
    renderTable([]);
  } finally {
    hideLoading();
  }
}

function goToPage(page) {
  if (page < 1 || page > state.totalPages) return;
  state.page = page;
  loadSiswa();
}

function openFormModal(mode, siswa = null) {
  clearFieldErrors();
  el.siswaForm.reset();
  state.editingId = null;

  if (mode === 'edit' && siswa) {
    state.editingId = siswa.id;
    el.formModalTitle.textContent = 'Edit Siswa';
    el.siswaId.value = siswa.id;
    inputs.nis.value = siswa.nis;
    inputs.nama.value = siswa.nama;
    inputs.kelas.value = siswa.kelas;
    inputs.jurusan.value = siswa.jurusan;
    inputs.alamat.value = siswa.alamat;
  } else {
    el.formModalTitle.textContent = 'Tambah Siswa';
    el.siswaId.value = '';
  }
  el.formModal.classList.remove('hidden');
}

function closeFormModal() {
  el.formModal.classList.add('hidden');
  el.siswaForm.reset();
  clearFieldErrors();
  state.editingId = null;
}

function validateFormClientSide() {
  let valid = true;
  clearFieldErrors();
  const rules = [
    { field: 'nis', test: (v) => v.trim().length >= 3, msg: 'NIS minimal 3 karakter.' },
    { field: 'nama', test: (v) => v.trim().length >= 3, msg: 'Nama minimal 3 karakter.' },
    { field: 'kelas', test: (v) => v.trim().length > 0, msg: 'Kelas wajib diisi.' },
    { field: 'jurusan', test: (v) => v.trim().length > 0, msg: 'Jurusan wajib diisi.' },
    { field: 'alamat', test: (v) => v.trim().length > 0, msg: 'Alamat wajib diisi.' },
  ];
  rules.forEach(({ field, test, msg }) => {
    const value = inputs[field].value || '';
    if (!test(value)) {
      document.getElementById(`error-${field}`).textContent = msg;
      valid = false;
    }
  });
  return valid;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateFormClientSide()) return;

  const formData = new FormData();
  formData.append('nis', inputs.nis.value.trim());
  formData.append('nama', inputs.nama.value.trim());
  formData.append('kelas', inputs.kelas.value.trim());
  formData.append('jurusan', inputs.jurusan.value.trim());
  formData.append('alamat', inputs.alamat.value.trim());
  if (inputs.foto.files[0]) formData.append('foto', inputs.foto.files[0]);

  el.submitFormBtn.disabled = true;
  el.submitFormBtn.textContent = 'Menyimpan...';
  showLoading();

  try {
    if (state.editingId) {
      const res = await updateSiswa(state.editingId, formData);
      showToast(res.message || 'Data siswa berhasil diperbarui.', 'success');
    } else {
      const res = await createSiswa(formData);
      showToast(res.message || 'Siswa berhasil ditambahkan.', 'success');
    }
    closeFormModal();
    await loadSiswa();
  } catch (err) {
    if (err.details && Array.isArray(err.details.errors)) {
      err.details.errors.forEach((msg) => showToast(msg, 'error'));
    } else {
      showToast(err.message || 'Gagal menyimpan data siswa.', 'error');
    }
  } finally {
    el.submitFormBtn.disabled = false;
    el.submitFormBtn.textContent = 'Simpan';
    hideLoading();
  }
}

function openDeleteModal(id, nama) {
  state.deleteTargetId = id;
  el.deleteSiswaName.textContent = nama;
  el.deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  el.deleteModal.classList.add('hidden');
  state.deleteTargetId = null;
}

async function handleConfirmDelete() {
  if (!state.deleteTargetId) return;
  showLoading();
  try {
    const res = await deleteSiswa(state.deleteTargetId);
    showToast(res.message || 'Siswa berhasil dihapus.', 'success');
    closeDeleteModal();
    await loadSiswa();
  } catch (err) {
    showToast(err.message || 'Gagal menghapus siswa.', 'error');
  } finally {
    hideLoading();
  }
}

el.tableBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id, nama } = btn.dataset;
  if (action === 'edit') {
    showLoading();
    try {
      const res = await fetchSiswaById(id);
      openFormModal('edit', res.data);
    } catch (err) {
      showToast(err.message || 'Gagal mengambil data siswa.', 'error');
    } finally {
      hideLoading();
    }
  }
  if (action === 'delete') openDeleteModal(id, nama);
});

el.btnTambah.addEventListener('click', () => openFormModal('add'));
el.closeFormModal.addEventListener('click', closeFormModal);
el.cancelFormBtn.addEventListener('click', closeFormModal);
el.siswaForm.addEventListener('submit', handleFormSubmit);
el.closeDeleteModal.addEventListener('click', closeDeleteModal);
el.cancelDeleteBtn.addEventListener('click', closeDeleteModal);
el.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

el.searchInput.addEventListener('input', debounce((e) => {
  state.search = e.target.value;
  state.page = 1;
  loadSiswa();
}));

el.filterKelas.addEventListener('change', (e) => {
  state.kelas = e.target.value;
  state.page = 1;
  loadSiswa();
});

[el.formModal, el.deleteModal].forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
});

function initDarkMode() {
  const saved = localStorage.getItem('sms_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    el.darkModeToggle.textContent = '☀️';
  }
}

el.darkModeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    el.darkModeToggle.textContent = '🌙';
    localStorage.setItem('sms_theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    el.darkModeToggle.textContent = '☀️';
    localStorage.setItem('sms_theme', 'dark');
  }
});

initDarkMode();
loadSiswa();