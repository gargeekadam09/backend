const db = require('../config/db');

// Get all sales (admin only)
exports.getAllSales = async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT s.*, b.title as service_title, c.name as customer_name 
      FROM sales s
      LEFT JOIN services b ON s.service_id = b.id
      LEFT JOIN customers c ON s.customer_id = c.id
    `);
    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sales for the logged-in customer
exports.getCustomerSales = async (req, res) => {
  try {
    console.log("Get customer sales request, user:", req.user);
    let customerId = null;
    
    // Try to get customer ID from token
    if (req.user && req.user.customerId) {
      customerId = req.user.customerId;
    } else if (req.user && req.user.userId) {
      // If not in token directly, try to get from user record
      const [userData] = await db.query(`
        SELECT customer_id FROM users WHERE id = ?
      `, [req.user.userId]);
      
      if (userData.length > 0 && userData[0].customer_id) {
        customerId = userData[0].customer_id;
      }
    }
    
    // For testing - if no customer ID found in token, check if it's in query params
    if (!customerId && req.query.customer_id) {
      customerId = parseInt(req.query.customer_id);
    }
    
    console.log("Looking up sales for customer ID:", customerId);
    
    if (!customerId) {
      return res.status(400).json({ message: 'User is not associated with a customer account' });
    }
    
    const [sales] = await db.query(`
      SELECT s.*, b.title as service_title
      FROM sales s
      LEFT JOIN services b ON s.service_id = b.id
      WHERE s.customer_id = ?
    `, [customerId]);
    
    console.log(`Found ${sales.length} sales for customer ${customerId}`);
    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching customer sales:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new sale
exports.createSale = async (req, res) => {
  try {
    console.log("Create sale request:", req.body);
    console.log("User from token:", req.user);
    
    const { service_id, quantity, customer_id } = req.body;
    
    // For customer purchases, use the logged-in customer's ID
    let effectiveCustomerId = customer_id;
    
    // Try to get customer ID from token if not provided in request
    if (!effectiveCustomerId && req.user) {
      if (req.user.customerId) {
        effectiveCustomerId = req.user.customerId;
      } else if (req.user.userId) {
        // If token doesn't have customer ID directly, get it from the user record
        const [userData] = await db.query(`
          SELECT customer_id FROM users WHERE id = ?
        `, [req.user.userId]);
        
        if (userData.length > 0 && userData[0].customer_id) {
          effectiveCustomerId = userData[0].customer_id;
        }
      }
    }
    
    console.log("Effective customer ID for sale:", effectiveCustomerId);
    
    // Basic validation
    if (!service_id || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        message: 'Service ID and quantity (> 0) are required' 
      });
    }
    
    if (!effectiveCustomerId) {
      return res.status(400).json({ 
        message: 'Customer ID is required' 
      });
    }
    
    // Check if service exists and has enough stock
    const [service] = await db.query('SELECT * FROM services WHERE id = ?', [service_id]);
    
    if (service.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    if (service[0].stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    
    // Calculate total price
    const servicePrice = typeof service[0].price === 'string' 
      ? parseFloat(service[0].price) 
      : service[0].price;
      
    const total_price = servicePrice * quantity;
    
    // Begin transaction
    await db.query('START TRANSACTION');
    
    // Create sale record
    const [result] = await db.query(
      'INSERT INTO sales (customer_id, service_id, quantity, total_price) VALUES (?, ?, ?, ?)',
      [effectiveCustomerId, service_id, quantity, total_price]
    );
    
    // Update service stock
    await db.query(
      'UPDATE services SET stock = stock - ? WHERE id = ?',
      [quantity, service_id]
    );
    
    // Commit transaction
    await db.query('COMMIT');
    
    // Get the new sale with related data
    const [newSale] = await db.query(`
      SELECT s.*, b.title as service_title, c.name as customer_name 
      FROM sales s
      LEFT JOIN services b ON s.service_id = b.id
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.id = ?
    `, [result.insertId]);
    
    console.log("Sale created successfully:", newSale[0]);
    res.status(201).json(newSale[0]);
  } catch (error) {
    // Rollback in case of error
    await db.query('ROLLBACK');
    console.error('Error creating sale:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a sale (admin only)
exports.deleteSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    
    // Check if sale exists
    const [existingSale] = await db.query('SELECT * FROM sales WHERE id = ?', [saleId]);
    
    if (existingSale.length === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    await db.query('DELETE FROM sales WHERE id = ?', [saleId]);
    
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};