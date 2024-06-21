const express = require('express');
const cors = require('cors');
const app = express();
const orderRoutes = require('./routes/orderRoutes');

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3001', // Permitir solicitudes desde este origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


