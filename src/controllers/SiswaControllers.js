const Siswa = require('../../models/SiswaModels');

class SiswaControllers {
    static async getAllSiswa(req, res) {
        try {
            const { search, kelas, page, limit } = req.query;
            const result = await Siswa.findAll({ search, kelas, page, limit });
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal mengambil data siswa' });
        }
    }

    static async getSiswaById(req, res) {
        try {
            const siswa = await Siswa.findById(req.params.id);
            if (!siswa) return res.status(404).json({ error: 'Siswa tidak ditemukan' });
            res.json({ data: siswa });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal mengambil data siswa' });
        }
    }

    static async createSiswa(req, res) {
        const { nis, nama, kelas, jurusan, alamat } = req.body;
        const foto = req.file ? `/uploads/${req.file.filename}` : null;

        if (!nis || !nama || !kelas || !jurusan || !alamat) {
            return res.status(400).json({ error: 'Semua field wajib diisi' });
        }

        try {
            const existing = await Siswa.findByNis(nis);
            if (existing) {
                return res.status(409).json({ error: `NIS "${nis}" sudah terdaftar` });
            }
            const newSiswa = await Siswa.create({ nis, nama, kelas, jurusan, alamat, foto });
            res.status(201).json({ message: 'Siswa berhasil ditambahkan', data: newSiswa });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal menambahkan siswa' });
        }
    }

    static async updateSiswa(req, res) {
        const { nis, nama, kelas, jurusan, alamat } = req.body;
        const foto = req.file ? `/uploads/${req.file.filename}` : req.body.foto || null;

        if (!nis || !nama || !kelas || !jurusan || !alamat) {
            return res.status(400).json({ error: 'Semua field wajib diisi' });
        }

        try {
            const existing = await Siswa.findById(req.params.id);
            if (!existing) return res.status(404).json({ error: 'Siswa tidak ditemukan' });

            const nisOwner = await Siswa.findByNis(nis);
            if (nisOwner && String(nisOwner.id) !== String(req.params.id)) {
                return res.status(409).json({ error: `NIS "${nis}" sudah digunakan oleh siswa lain` });
            }

            const updatedSiswa = await Siswa.update(req.params.id, { nis, nama, kelas, jurusan, alamat, foto });
            res.json({ message: 'Data siswa berhasil diperbarui', data: updatedSiswa });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal memperbarui siswa' });
        }
    }

    static async deleteSiswa(req, res) {
        try {
            const deleted = await Siswa.remove(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Siswa tidak ditemukan' });
            res.json({ message: 'Siswa berhasil dihapus' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal menghapus siswa' });
        }
    }
}

module.exports = SiswaControllers;