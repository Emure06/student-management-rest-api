const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/UserModels')

const JWT_SECRET = 'kontol_memek_maul_monyet_123'
class UserControllers {
    // GET semua user
    static async GetUserAll(req, res) {
        try {
            const users = await User.getAll()
            res.json(users)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Gagal mengambil data user' })
        }
    }

    // GET user by id
    static async GetUserById(req, res) {
        try {
            const user = await User.getById(req.params.id)
            if (!user) return res.status(404).json({ error: 'User tidak ditemukan' })
            res.json(user)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Gagal mengambil data user' })
        }
    }

    // REGISTER user baru
    static async RegisterUser(req, res) {
        const { nama, email, password } = req.body

        if (!nama || nama.trim() === '') {
            return res.status(400).json({ error: 'Nama tidak boleh kosong' })
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Format email tidak valid' })
        }
        if (!password || password.trim() === '') {
            return res.status(400).json({ error: 'Password tidak boleh kosong' })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({ nama, email, password: hashedPassword })
            res.status(201).json(newUser)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Gagal menambahkan user' })
        }
    }

    // LOGIN — make token
    static async LoginUser(req, res) {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email dan password harus diisi' })
        }

        try {
            const user = await User.getByEmail(email)
            if (!user) {
                return res.status(404).json({ error: 'User tidak ditemukan' })
            }
            
            const isHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$')

            let isMatch = false
            if (isHashed) {
                isMatch = await bcrypt.compare(password, user.password)
            } else {
                isMatch = password === user.password
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Password salah' })
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            )

            res.json({ message: 'Login berhasil', token })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Gagal login' })
        }
    }

    // PUT update user
    static async UpdateUser(req, res) {
        const { nama, email, password } = req.body

        if (!nama || nama.trim() === '') {
            return res.status(400).json({ error: 'Nama tidak boleh kosong' })
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Format email tidak valid' })
        }
        if (!password || password.trim() === '') {
            return res.status(400).json({ error: 'Password tidak boleh kosong' })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const updatedUser = await User.update(req.params.id, { nama, email, password: hashedPassword })
            res.json(updatedUser)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Gagal memperbarui user' })
        }
    }

    // DELETE user
    static async DeleteUser(req, res) {
        try {
            const affected = await User.remove(req.params.id)
            if (!affected) return res.status(404).json({ error: 'User tidak ditemukan' })
            res.json({ message: 'User berhasil dihapus' })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Gagal menghapus user' })
        }
    }
}

module.exports = UserControllers