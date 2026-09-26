const express = require('express');
const router = express.Router();

const {
    GetProdukAll,
    GetProdukById,
    PostProduk,
    PutProduk,
    DeleteProduk
} = require('../controllers/ProductControllers');

router.get('/', GetProdukAll);
router.get('/:id', GetProdukById);
router.post('/post', PostProduk);
router.put('/:id', PutProduk);
router.delete('/:id', DeleteProduk);

module.exports = router;