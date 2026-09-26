const Product = require('../../models/ProductModels');

function validateProduct(data) {
    const errors = [];

    if (!data.nama || data.nama.trim() === '') {
        errors.push('Nama tidak boleh kosong');
    }
    if (data.harga === undefined || isNaN(data.harga) || Number(data.harga) <= 0) {
        errors.push('Harga harus berupa angka dan lebih dari 0');
    }
    if (data.stok === undefined || isNaN(data.stok) || Number(data.stok) < 0) {
        errors.push('Stok harus berupa angka dan tidak boleh negatif');
    }
    if (!data.kategori || data.kategori.trim() === '') {
        errors.push('Kategori tidak boleh kosong');
    }

    return errors;
}

class ProductControllers {
    // ambil semua data produk
    static async GetProdukAll(req, res) {
        try {
            const products = await Product.getAll();
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Gagal mengambil data produk' });
        }
    }

    // ambil produk by id
    static async GetProdukById(req, res) {
        try {
            const product = await Product.getById(req.params.id);
            if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });
            res.json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Gagal mengambil data produk' });
        }
    }

    // tambah produk baru
    static async PostProduk(req, res) {
        const errors = validateProduct(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const newProduct = await Product.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Gagal menambah produk' });
        }
    }

    // update produk
    static async PutProduk(req, res) {
        const errors = validateProduct(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const updatedProduct = await Product.update(req.params.id, req.body);
            res.json(updatedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Gagal update produk' });
        }
    }

    // hapus produk
    static async DeleteProduk(req, res) {
        try {
            const affected = await Product.remove(req.params.id);
            if (!affected) return res.status(404).json({ error: 'Produk tidak ditemukan' });
            res.json({ message: 'Produk berhasil dihapus' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Gagal menghapus produk' });
        }
    }
}

module.exports = ProductControllers;  