const jwt = require('jsonwebtoken')

const JWT_SECRET = 'kontol_memek_maul_monyet_123'  // harus SAMA PERSIS kayak yang di UserControllers.js

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // authHeader = "Bearer eyJhbG..."
    // .split(' ')[1] = ambil bagian setelah "Bearer ", yaitu tokennya doang

    if (!token) {
        return res.status(401).json({ error: 'Token tidak ditemukan, silakan login dulu' })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token tidak valid atau sudah kadaluarsa' })
        }
        req.user = decoded  // simpen data user (id, email) dari token, bisa dipakai di route lain
        next()  // token valid, lanjut ke route aslinya
    })
}

module.exports = authMiddleware