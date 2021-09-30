const express = require('express');
const router = express.Router();
const { createProduct,
        readProducts,
        readProduct,       
        updateProduct,
        updateProductPoster,
        updateProductGallery,
        deleteProduct,       
        deleteProductGalleryPhoto
} = require('../controllers/product.controller');
const auth = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadMiddleware")

router
    .get('/readProduct/:id', readProduct)
    .get('/readProducts',  readProducts)
    .post('/createProduct', upload("products").fields([
        { name: "poster", maxCount: 1 },
        { name: "gallery", maxCount: 5 }
    ]), createProduct)
    .put('/updateProduct', auth, updateProduct)
    .put('/updateProductPoster', auth, upload('products').single('poster'), updateProductPoster)
    .put('/updateProductGallery', auth, upload('products').array('gallery',5), updateProductGallery)
    .delete('/deleteProduct', auth, deleteProduct)
    .delete('/deleteProductGalleryPhoto', auth, deleteProductGalleryPhoto )


module.exports = router;