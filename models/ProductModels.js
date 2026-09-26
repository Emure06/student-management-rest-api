const db = require('../config/database');

const ProductModels = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM products');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const { nama, harga, stok, kategori } = data;
        const [result] = await db.query(
            'INSERT INTO products (nama, harga, stok, kategori) VALUES (?, ?, ?, ?)',
            [nama, harga, stok, kategori]
        );
        return { id: result.insertId, nama, harga, stok, kategori };
    },

    update: async (id, data) => {
        const { nama, harga, stok, kategori } = data;
        await db.query(
            'UPDATE products SET nama = ?, harga = ?, stok = ?, kategori = ? WHERE id = ?',
            [nama, harga, stok, kategori, id]
        );
        return { id, nama, harga, stok, kategori };
    },

    remove: async (id) => {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = ProductModels;