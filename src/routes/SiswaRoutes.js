const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const SiswaControllers = require('../controllers/SiswaControllers');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ok) return cb(null, true);
    cb(new Error('Format foto harus jpg, jpeg, png, atau webp.'));
  },
});


const optionalUpload = (req, res, next) => {
  upload.single('foto')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

router.get('/', SiswaControllers.getAllSiswa);
router.get('/:id', SiswaControllers.getSiswaById);
router.post('/', optionalUpload, SiswaControllers.createSiswa);
router.put('/:id', optionalUpload, SiswaControllers.updateSiswa);
router.delete('/:id', SiswaControllers.deleteSiswa);

module.exports = router;
//routes keluar (ke api nya)