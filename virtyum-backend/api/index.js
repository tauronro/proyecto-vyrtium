// Cargar variables de entorno antes que nada
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importar rutas
const taskRoutes = require('../src/routes/taskRoutes');
const serviceRoutes = require('../src/routes/serviceRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://virtyum-frontend-6rwfpqv5g-tauronros-projects.vercel.app',
    'https://virtyum-frontend-chi.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// Conexión a MongoDB (solo si no está conectado)
if (mongoose.connection.readyState === 0) {
  const mongoURI = process.env.MONGODB_URI;
  console.log('Conectando a MongoDB...');
  
  mongoose.connect(mongoURI)
    .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
    .catch((error) => {
      console.error('Error de conexión a MongoDB:', error);
    });
}

// Rutas
app.use('/api/tasks', taskRoutes);
app.use('/api/services', serviceRoutes);

// Ruta básica
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Virtyum funcionando correctamente en Vercel!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Ruta de salud para verificar el estado
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Virtyum Backend API',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Exportar el app para Vercel
module.exports = app; 