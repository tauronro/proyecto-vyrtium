/**
 * @fileoverview Controlador para la gestión de servicios de marketing
 * @description Maneja todas las operaciones CRUD y lógica de negocio para servicios
 * @author Virtyum Backend Team
 * @version 1.0.0
 */

const Service = require('../models/Service');

/**
 * Obtiene todos los servicios de la base de datos
 * @async
 * @function getAllServices
 * @param {Object} req - Objeto de request de Express
 * @param {Object} res - Objeto de response de Express
 * @returns {Promise<void>} Lista de servicios ordenados por fecha de creación (más recientes primero)
 * @example
 * GET /api/services
 * Response: [
 *   {
 *     _id: "...",
 *     name: "SEO & Posicionamiento Web",
 *     category: "Digital",
 *     price: 899,
 *     status: "Activo",
 *     ...
 *   }
 * ]
 */
exports.getAllServices = async (req, res) => {
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

/**
 * Crea un nuevo servicio en la base de datos
 * @async
 * @function createService
 * @param {Object} req - Objeto de request de Express
 * @param {Object} req.body - Datos del servicio a crear
 * @param {string} req.body.name - Nombre del servicio
 * @param {string} req.body.category - Categoría del servicio
 * @param {number} req.body.price - Precio del servicio
 * @param {string} req.body.duration - Duración del servicio
 * @param {string} [req.body.status="Nuevo"] - Estado del servicio
 * @param {string} req.body.description - Descripción del servicio
 * @param {number} [req.body.clients=0] - Número de clientes
 * @param {Object} res - Objeto de response de Express
 * @returns {Promise<void>} Servicio creado con código 201
 * @example
 * POST /api/services
 * Body: {
 *   "name": "Email Marketing",
 *   "category": "Digital",
 *   "price": 399,
 *   "duration": "Mensual",
 *   "description": "Campañas automatizadas de email"
 * }
 */
exports.createService = async (req, res) => {
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
    
    // Manejo específico de errores de validación
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

/**
 * Obtiene un servicio específico por su ID
 * @async
 * @function getServiceById
 * @param {Object} req - Objeto de request de Express
 * @param {string} req.params.id - ID del servicio a buscar
 * @param {Object} res - Objeto de response de Express
 * @returns {Promise<void>} Servicio encontrado o error 404
 * @example
 * GET /api/services/507f1f77bcf86cd799439011
 */
exports.getServiceById = async (req, res) => {
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
    
    // Manejo específico de errores de ObjectId inválido
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

/**
 * Actualiza un servicio existente
 * @async
 * @function updateService
 * @param {Object} req - Objeto de request de Express
 * @param {string} req.params.id - ID del servicio a actualizar
 * @param {Object} req.body - Datos a actualizar (campos opcionales)
 * @param {Object} res - Objeto de response de Express
 * @returns {Promise<void>} Servicio actualizado o error 404
 * @example
 * PUT /api/services/507f1f77bcf86cd799439011
 * Body: {
 *   "price": 599,
 *   "status": "Activo"
 * }
 */
exports.updateService = async (req, res) => {
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

/**
 * Elimina un servicio de la base de datos
 * @async
 * @function deleteService
 * @param {Object} req - Objeto de request de Express
 * @param {string} req.params.id - ID del servicio a eliminar
 * @param {Object} res - Objeto de response de Express
 * @returns {Promise<void>} Confirmación de eliminación o error 404
 * @example
 * DELETE /api/services/507f1f77bcf86cd799439011
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      await service.deleteOne();
      res.json({ 
        message: 'Servicio eliminado correctamente',
        deletedService: {
          id: service._id,
          name: service.name
        }
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

/**
 * Obtiene servicios filtrados por categoría
 * @async
 * @function getServicesByCategory
 * @param {Object} req - Objeto de request de Express
 * @param {string} req.params.category - Categoría a filtrar
 * @param {Object} res - Objeto de response de Express
 * @returns {Promise<void>} Lista de servicios de la categoría especificada
 * @example
 * GET /api/services/category/Digital
 */
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validar que la categoría existe en el enum
    const validCategories = ['Digital', 'Social', 'Contenido', 'Diseño', 'Desarrollo', 'Análisis'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Categoría inválida',
        validCategories,
        receivedCategory: category
      });
    }
    
    const services = await Service.find({ category }).sort({ createdAt: -1 });
    
    res.json({
      category,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Error al obtener servicios por categoría:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtiene estadísticas generales de los servicios
 * @async
 * @function getServiceStats
 * @param {Object} req - Objeto de request de Express
 * @param {Object} res - Objeto de response de Express
 * @returns {Promise<void>} Objeto con estadísticas agregadas
 * @example
 * GET /api/services/stats
 * Response: {
 *   totalServices: 10,
 *   activeServices: 8,
 *   totalClients: 473,
 *   totalCategories: 6,
 *   categories: ["Digital", "Social", ...]
 * }
 */
exports.getServiceStats = async (req, res) => {
  try {
    // Ejecutar múltiples consultas en paralelo para mejor rendimiento
    const [
      totalServices,
      activeServices,
      newServices,
      pausedServices,
      inactiveServices,
      totalClientsResult,
      categories,
      averagePriceResult
    ] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ status: 'Activo' }),
      Service.countDocuments({ status: 'Nuevo' }),
      Service.countDocuments({ status: 'Pausado' }),
      Service.countDocuments({ status: 'Inactivo' }),
      Service.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$clients' }
          }
        }
      ]),
      Service.distinct('category'),
      Service.aggregate([
        {
          $group: {
            _id: null,
            averagePrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ])
    ]);

    const stats = {
      overview: {
        totalServices,
        activeServices,
        newServices,
        pausedServices,
        inactiveServices
      },
      clients: {
        totalClients: totalClientsResult[0]?.total || 0
      },
      categories: {
        totalCategories: categories.length,
        availableCategories: categories
      },
      pricing: {
        averagePrice: Math.round(averagePriceResult[0]?.averagePrice || 0),
        minPrice: averagePriceResult[0]?.minPrice || 0,
        maxPrice: averagePriceResult[0]?.maxPrice || 0
      },
      lastUpdated: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 