const db = require('../config/database');

const UserModels = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM user');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
        return rows[0];
    },

    getByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        return rows[0];
    },

    create: async (data) => {
        const { nama, email, password } = data;
        const [result] = await db.query(
            'INSERT INTO user (nama, email, password) VALUES (?, ?, ?)',
            [nama, email, password]
        );
        return { id: result.insertId, nama, email };
    },

    update: async (id, data) => {
        const { nama, email, password } = data;
        await db.query(
            'UPDATE user SET nama = ?, email = ?, password = ? WHERE id = ?',
            [nama, email, password, id]
        );
        return { id, nama, email };
    },

    remove: async (id) => {
        const [result] = await db.query('DELETE FROM user WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = UserModels;