const { validationResult, body } = require('express-validator')

/**
 * Run after express-validator chains – returns 422 if errors exist
 */
function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error:  'Validation failed',
      fields: errors.array().map(e => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

// ── Reusable Validation Chains ─────────────────────────────────
const registerRules = [
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email')
    .trim().normalizeEmail().isEmail().withMessage('Invalid email address'),
  body('phone')
    .trim().notEmpty().withMessage('Phone number is required')
    .matches(/^(\+?254|0)[17]\d{8}$/).withMessage('Enter a valid Kenyan phone number'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
]

const loginRules = [
  body('email').trim().normalizeEmail().isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('categoryId').notEmpty().withMessage('Category is required'),
]

const orderRules = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.county').notEmpty().withMessage('County is required'),
  body('shippingAddress.town').notEmpty().withMessage('Town is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street is required'),
]

module.exports = { validate, registerRules, loginRules, productRules, orderRules }
