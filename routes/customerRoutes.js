const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();

// GET /api/customers - Get all customers
router.get('/', customerController.getAllCustomers);

// GET /api/customers/:id - Get a customer by ID
router.get('/:id', customerController.getCustomerById);

// POST /api/customers - Create a new customer
router.post('/', customerController.createCustomer);

// PUT /api/customers/:id - Update a customer
router.put('/:id', customerController.updateCustomer);

// DELETE /api/customers/:id - Delete a customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;