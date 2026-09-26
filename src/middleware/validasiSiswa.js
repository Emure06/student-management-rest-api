function validateSiswaInput(req, res, next) {
  const { nis, nama, kelas, jurusan, alamat } = req.body;
  const errors = [];

  if (!nis || typeof nis !== "string" || nis.trim() === "") {
    errors.push("NIS wajib diisi.");
  } else if (!/^[0-9A-Za-z\-]{3,20}$/.test(nis.trim())) {
    errors.push("NIS harus berupa angka/huruf (3-20 karakter), tanpa spasi.");
  }

  if (!nama || typeof nama !== "string" || nama.trim().length < 3) {
    errors.push("Nama wajib diisi, minimal 3 karakter.");
  }

  if (!kelas || typeof kelas !== "string" || kelas.trim() === "") {
    errors.push("Kelas wajib diisi.");
  }

  if (!jurusan || typeof jurusan !== "string" || jurusan.trim() === "") {
    errors.push("Jurusan wajib diisi.");
  }

  if (!alamat || typeof alamat !== "string" || alamat.trim() === "") {
    errors.push("Alamat wajib diisi.");
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: "Validasi gagal.", errors });
  }

  req.body.nis = nis.trim();
  req.body.nama = nama.trim();
  req.body.kelas = kelas.trim();
  req.body.jurusan = jurusan.trim();
  req.body.alamat = alamat.trim();

  next();
}

function validateIdParam(req, res, next) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Parameter id tidak valid, harus berupa angka.",
    });
  }
  next();
}

module.exports = { validateSiswaInput, validateIdParam };
