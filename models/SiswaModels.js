const db = require("../config/database");

async function findAll({ search = "", kelas = "", page = 1, limit = 10 } = {}) {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const offset = (pageNum - 1) * limitNum;

  const filters = [];
  const params = [];

  if (search) {
    filters.push("(nama LIKE ? OR nis LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (kelas) {
    filters.push("kelas = ?");
    params.push(kelas);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM siswa ${whereClause}`,
    params,
  );
  const [rows] = await db.query(
    `SELECT * FROM siswa ${whereClause} ORDER BY id ASC LIMIT ? OFFSET ?`,
    [...params, limitNum, offset],
  );

  const total = countRows[0].total;
  return {
    data: rows,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

async function findById(id) {
  const [rows] = await db.query("SELECT * FROM siswa WHERE id = ?", [id]);
  return rows[0] || null;
}

async function findByNis(nis) {
  const [rows] = await db.query("SELECT * FROM siswa WHERE nis = ?", [nis]);
  return rows[0] || null;
}

async function create({ nis, nama, kelas, jurusan, alamat, foto = null }) {
  const [result] = await db.query(
    `INSERT INTO siswa (nis, nama, kelas, jurusan, alamat, foto) VALUES (?, ?, ?, ?, ?, ?)`,
    [nis, nama, kelas, jurusan, alamat, foto],
  );
  return findById(result.insertId);
}

async function update(id, { nis, nama, kelas, jurusan, alamat, foto = null }) {
  await db.query(
    `UPDATE siswa SET nis = ?, nama = ?, kelas = ?, jurusan = ?, alamat = ?, foto = ? WHERE id = ?`,
    [nis, nama, kelas, jurusan, alamat, foto, id],
  );
  return findById(id);
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) return null;
  await db.query("DELETE FROM siswa WHERE id = ?", [id]);
  return existing;
}

module.exports = {
  findAll,
  findById,
  findByNis,
  create,
  update,
  remove,
};
