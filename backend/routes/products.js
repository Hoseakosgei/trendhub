const router = require('express').Router()
const {
  getProducts, getProduct,
  createProduct, updateProduct, deleteProduct,
  getCategories,
} = require('../controllers/productController')
const { protect, requireAdmin, optionalAuth } = require('../middleware/auth')
const { productRules, validate } = require('../middleware/validation')

// Public
router.get('/categories', getCategories)
router.get('/',           optionalAuth, getProducts)
router.get('/:id',        optionalAuth, getProduct)

// Admin only
router.post('/',     protect, requireAdmin, productRules, validate, createProduct)
router.put('/:id',   protect, requireAdmin, updateProduct)
router.delete('/:id',protect, requireAdmin, deleteProduct)

module.exports = router
