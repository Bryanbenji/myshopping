const db = require('../db/config');

const getAllOrders = (callback) => {
  const query = 'SELECT * FROM orders';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err);
    }

    console.log('Query results:', results); // Añadir log para depurar
    callback(null, results); // Asegúrate de que 'results' es un array
  });
};

const getOrderById = (orderId, callback) => {
    const query = 'SELECT * FROM orders WHERE id = ?';
    db.query(query, [orderId], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error('Order not found'));
      callback(null, results[0]);
    });
  };

const createOrder = (order, callback) => {
  const query = 'INSERT INTO orders (product_id, product_image, quantity, customer_data) VALUES (?, ?, ?, ?)';
  const values = [order.product_id, order.product_image, order.quantity, order.customer_data];
  db.query(query, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrderById
};
