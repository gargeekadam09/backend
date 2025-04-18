const db = require('../config/db');

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.query('SELECT * FROM customers');
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const [customer] = await db.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    
    if (customer.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(200).json(customer[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, address || null]
    );
    
    const [newCustomer] = await db.query('SELECT * FROM customers WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newCustomer[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customerId = req.params.id;
    
    // Check if customer exists
    const [existingCustomer] = await db.query('SELECT * FROM customers WHERE id = ?', [customerId]);
    
    if (existingCustomer.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    await db.query(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [
        name || existingCustomer[0].name,
        email || existingCustomer[0].email,
        phone !== undefined ? phone : existingCustomer[0].phone,
        address !== undefined ? address : existingCustomer[0].address,
        customerId
      ]
    );
    
    const [updatedCustomer] = await db.query('SELECT * FROM customers WHERE id = ?', [customerId]);
    
    res.status(200).json(updatedCustomer[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    
    // Check if customer exists
    const [existingCustomer] = await db.query('SELECT * FROM customers WHERE id = ?', [customerId]);
    
    if (existingCustomer.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    await db.query('DELETE FROM customers WHERE id = ?', [customerId]);
    
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};