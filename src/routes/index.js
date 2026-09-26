const express = require('express');
const router = express.Router();

const siswaRoutes = require('./SiswaRoutes');

router.use('/api/siswa', siswaRoutes);

module.exports = router;