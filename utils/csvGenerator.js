const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const generateCSV = async (orders) => {
  console.log('Orders:', orders); // Añadir log para depurar

  const csvWriter = createCsvWriter({
    path: path.join(__dirname, '../orders.csv'),
    header: [
      { id: 'id', title: 'ID' },
      { id: 'product_id', title: 'PRODUCT_ID' },
      { id: 'product_image', title: 'PRODUCT_IMAGE' },
      { id: 'quantity', title: 'QUANTITY' },
      { id: 'customer_data', title: 'CUSTOMER_DATA' },
    ]
  });

  if (!Array.isArray(orders)) {
    throw new Error('orders is not an array');
  }

  orders.forEach(order => {
    if (!order.id || !order.product_id || !order.product_image || !order.quantity || !order.customer_data) {
      throw new Error('order object is missing required properties');
    }
  });

  await csvWriter.writeRecords(orders);
  console.log('CSV file was written successfully');
};

const readCSV = async () => {
  const csvPath = path.join(__dirname, '../orders.csv');
  const csvData = await fs.promises.readFile(csvPath, 'utf8');
  return csvData;
};

module.exports = {
  generateCSV,
  readCSV,
};
