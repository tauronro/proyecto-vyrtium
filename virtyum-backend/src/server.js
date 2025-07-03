// Cargar variables de entorno antes que nada
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

// Verificar las variables de entorno
console.log('Verificando variables de entorno:');
console.log('PORT:', process.env.PORT ? 'Definida' : 'No definida');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Definida' : 'No definida');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const mongoURI = process.env.MONGODB_URI;
console.log('Intentando conectar a MongoDB...');

mongoose.connect(mongoURI)
.then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
.catch((error) => {
  console.error('Error detallado de conexión a MongoDB:', error);
  process.exit(1); // Detener la aplicación si no se puede conectar a la BD
});

// Rutas
app.use('/api/tasks', taskRoutes);
app.use('/api/services', serviceRoutes);

// Ruta básica
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
