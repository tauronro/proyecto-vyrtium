// Cargar variables de entorno antes que nada
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Variable para rastrear el estado de la conexión
let isConnected = false;

// Definir el esquema de Service directamente aquí
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['Digital', 'Social', 'Contenido', 'Diseño', 'Desarrollo', 'Análisis'],
      message: 'La categoría debe ser: Digital, Social, Contenido, Diseño, Desarrollo o Análisis'
    }
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  duration: {
    type: String,
    required: [true, 'La duración es obligatoria'],
    maxlength: [50, 'La duración no puede exceder 50 caracteres']
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['Activo', 'Nuevo', 'Pausado', 'Inactivo'],
      message: 'El estado debe ser: Activo, Nuevo, Pausado o Inactivo'
    },
    default: 'Nuevo'
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  clients: {
    type: Number,
    default: 0,
    min: [0, 'El número de clientes no puede ser negativo']
  }
}, {
  timestamps: true,
  versionKey: false
});

// Crear el modelo
const Service = mongoose.model('Service', serviceSchema);

// Función para conectar a MongoDB
const connectMongoDB = async () => {
  if (isConnected) {
    return Promise.resolve();
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('🔄 Intentando conectar a MongoDB...');
    console.log('URI disponible:', mongoURI ? 'SÍ' : 'NO');
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI no está definida en las variables de entorno');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('✅ Conectado exitosamente a MongoDB Atlas');
    console.log('Estado de conexión:', mongoose.connection.readyState);
    
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    console.error('Detalles del error:', error);
    isConnected = false;
    throw error;
  }
};

// Middleware
app.use(cors({
  origin: [
    'https://virtyum-frontend-lemon.vercel.app',
    'https://virtyum-frontend-q163wctcg-tauronros-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// Middleware para asegurar conexión a MongoDB antes de procesar requests
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api/') && req.path !== '/api/health') {
    try {
      await connectMongoDB();
      next();
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB en middleware:', error);
      res.status(500).json({
        message: 'Error de conexión a la base de datos',
        error: 'No se pudo establecer conexión con MongoDB'
      });
    }
  } else {
    next();
  }
});

// Controladores inline
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al obtener servicios',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const createService = async (req, res) => {
  const service = new Service({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    duration: req.body.duration,
    status: req.body.status || 'Nuevo',
    description: req.body.description,
    clients: req.body.clients || 0
  });

  try {
    const newService = await service.save();
    res.status(201).json({
      message: 'Servicio creado exitosamente',
      service: newService
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ 
        message: 'Error de validación',
        errors: validationErrors
      });
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor al crear servicio',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ 
        message: 'Servicio no encontrado',
        id: req.params.id
      });
    }
  } catch (error) {
    console.error('Error al obtener servicio por ID:', error);
    
    if (error.name === 'CastError') {
      res.status(400).json({ 
        message: 'ID de servicio inválido',
        id: req.params.id
      });
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      service.name = req.body.name || service.name;
      service.category = req.body.category || service.category;
      service.price = req.body.price !== undefined ? req.body.price : service.price;
      service.duration = req.body.duration || service.duration;
      service.status = req.body.status || service.status;
      service.description = req.body.description || service.description;
      service.clients = req.body.clients !== undefined ? req.body.clients : service.clients;

      const updatedService = await service.save();
      res.json({
        message: 'Servicio actualizado exitosamente',
        service: updatedService
      });
    } else {
      res.status(404).json({ 
        message: 'Servicio no encontrado para actualizar',
        id: req.params.id
      });
    }
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ 
        message: 'Error de validación en actualización',
        errors: validationErrors
      });
    } else if (error.name === 'CastError') {
      res.status(400).json({ 
        message: 'ID de servicio inválido',
        id: req.params.id
      });
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor al actualizar',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      await Service.findByIdAndDelete(req.params.id);
      res.json({
        message: 'Servicio eliminado exitosamente',
        deletedService: service
      });
    } else {
      res.status(404).json({ 
        message: 'Servicio no encontrado para eliminar',
        id: req.params.id
      });
    }
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    
    if (error.name === 'CastError') {
      res.status(400).json({ 
        message: 'ID de servicio inválido',
        id: req.params.id
      });
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor al eliminar',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

// Rutas de servicios
app.get('/api/services', getAllServices);
app.post('/api/services', createService);
app.get('/api/services/:id', getServiceById);
app.put('/api/services/:id', updateService);
app.delete('/api/services/:id', deleteService);

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

// Inicializar conexión
connectMongoDB().catch(error => {
  console.error('❌ Error en conexión inicial:', error);
});

// Exportar el app para Vercel
module.exports = app; 