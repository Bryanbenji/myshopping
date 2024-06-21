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
};
