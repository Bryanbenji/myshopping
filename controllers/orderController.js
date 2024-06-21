const orderModel = require('../models/orderModel');
const axios = require('axios');
const { generateCSV, readCSV } = require('../utils/csvGenerator');

const createOrder = async (req, res) => {
  const { product_id, quantity, customer_data } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  if (!customer_data || typeof customer_data !== 'string') {
    return res.status(400).json({ error: 'Invalid customer data' });
  }

  try {
    console.log(`Fetching data for Pokémon ID: ${product_id}`);
    let response;
    try {
      response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${product_id}`);
    } catch (apiError) {
      console.error(`Error fetching data for Pokémon ID: ${product_id}`, apiError.response ? apiError.response.data : apiError.message);
      return res.status(500).json({ error: `Error fetching Pokémon data for ID: ${product_id}` });
    }

    const product_image = response.data.sprites.front_default;
    console.log(`Fetched data for Pokémon ID: ${product_id}, Image URL: ${product_image}`);

    await new Promise((resolve, reject) => {
      orderModel.createOrder({
        product_id,
        product_image,
        quantity,
        customer_data
      }, (err, result) => {
        if (err) {
          console.error('Error creating order in DB:', err);
          return reject(err);
        }
        resolve(result);
      });
    });

    orderModel.getUnupdatedOrders((err, orders) => {
      if (err) {
        console.error('Error fetching unupdated orders:', err);
        return res.status(500).json({ error: 'Error fetching unupdated orders' });
      }

      console.log('Fetched unupdated orders:', orders); // Añadir log para depurar

      if (!Array.isArray(orders)) {
        console.error('Fetched orders is not an array');
        return res.status(500).json({ error: 'Fetched orders is not an array' });
      }

      generateCSV(orders)
        .then(() => {
          res.status(201).json({ message: 'Order created and CSV generated successfully' });
        })
        .catch(csvError => {
          console.error('Error generating CSV:', csvError);
          res.status(500).json({ error: 'Error generating CSV' });
        });
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

const getAllOrders = (req, res) => {
  orderModel.getAllOrders((err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(orders);
  });
};

const getOrderById = (req, res) => {
  const { orderId } = req.params;
  orderModel.getOrderById(orderId, (err, order) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(order);
  });
};

const sendCSVToInventory = async (req, res) => {
  try {
    const csvData = await readCSV();
    const response = await axios.post('http://localhost:3002/api/upload-csv-data', { csvData }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Actualizar el campo actualizado a 1
    await new Promise((resolve, reject) => {
      orderModel.updateOrdersStatus((err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.status(200).json({ message: 'CSV data sent to inventory successfully', response: response.data });
  } catch (error) {
    console.error('Error sending CSV data to inventory:', error);
    res.status(500).json({ error: 'Error sending CSV data to inventory' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  sendCSVToInventory
};
