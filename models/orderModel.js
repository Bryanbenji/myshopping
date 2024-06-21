const db = require('../db/config');

const getAllOrders = (callback) => {
  const query = 'SELECT * FROM orders';
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
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

const getUnupdatedOrders = (callback) => {
  const query = 'SELECT * FROM orders WHERE actualizado = 0';
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const createOrder = (order, callback) => {
  const query = 'INSERT INTO orders (product_id, product_image, quantity, customer_data, actualizado) VALUES (?, ?, ?, ?, 0)';
  const values = [order.product_id, order.product_image, order.quantity, order.customer_data];
  db.query(query, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const updateOrdersStatus = (callback) => {
  const query = 'UPDATE orders SET actualizado = 1 WHERE actualizado = 0';
  db.query(query, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  getUnupdatedOrders,
  createOrder,
  updateOrdersStatus,
};
