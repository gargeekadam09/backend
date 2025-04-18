const express = require('express');
const saleController = require('../controllers/saleController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Admin routes
router.get('/', authMiddleware.optionalVerifyToken, saleController.getAllSales);
router.delete('/:id', authMiddleware.optionalVerifyToken, saleController.deleteSale);

// Routes for customer purchases
router.post('/', authMiddleware.optionalVerifyToken, saleController.createSale);
router.get('/my-purchases', authMiddleware.optionalVerifyToken, saleController.getCustomerSales);

module.exports = router;