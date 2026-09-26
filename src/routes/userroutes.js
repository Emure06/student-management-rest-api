const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')

const {
    GetUserAll,
    GetUserById,
    RegisterUser,
    LoginUser,
    UpdateUser,
    DeleteUser
} = require('../controllers/UserControllers')

router.get('/get', GetUserAll)

router.get('/getid/:id', GetUserById)

router.post('/register', RegisterUser)

router.post('/login', LoginUser)

router.put('/put/:id', authMiddleware, UpdateUser)

router.delete('/delete/:id', authMiddleware, DeleteUser)

module.exports = router