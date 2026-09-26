const API_BASE_URL = '/api/siswa';

async function handleResponse(response) {
  let body;
  try {
    body = await response.json();
  } catch (e) {
    throw new Error('Response server tidak valid (bukan JSON).');
  }

  if (!response.ok) {
    const message = body && body.error ? body.error : `Request gagal (status ${response.status}).`;
    const error = new Error(message);
    error.details = body;
    throw error;
  }
  return body;
}

async function fetchSiswaList(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query.append(key, value);
    }
  });
  const url = query.toString() ? `${API_BASE_URL}?${query.toString()}` : API_BASE_URL;
  const response = await fetch(url, { method: 'GET' });
  return handleResponse(response);
}

async function fetchSiswaById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'GET' });
  return handleResponse(response);
}

async function createSiswa(formData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
}

async function updateSiswa(id, formData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return handleResponse(response);
}

async function deleteSiswa(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse(response);
}