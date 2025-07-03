/**
 * @fileoverview Modelo de datos para servicios de marketing
 * @description Define la estructura y validaciones para los servicios que ofrece Virtyum
 * @author Virtyum Backend Team
 * @version 1.0.0
 */

const mongoose = require('mongoose');

/**
 * Esquema de la base de datos para servicios de marketing
 * @typedef {Object} Service
 * @property {string} name - Nombre del servicio (requerido)
 * @property {string} category - Categoría del servicio (Digital, Social, Contenido, Diseño, Desarrollo, Análisis)
 * @property {number} price - Precio del servicio en USD (mínimo 0)
 * @property {string} duration - Duración estimada del servicio
 * @property {string} status - Estado actual del servicio (Activo, Nuevo, Pausado, Inactivo)
 * @property {string} description - Descripción detallada del servicio
 * @property {number} clients - Número de clientes que utilizan este servicio (default: 0)
 * @property {Date} createdAt - Fecha de creación (automático)
 * @property {Date} updatedAt - Fecha de última actualización (automático)
 */
const serviceSchema = new mongoose.Schema({
  // Información básica del servicio
  name: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  
  // Categorización del servicio
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['Digital', 'Social', 'Contenido', 'Diseño', 'Desarrollo', 'Análisis'],
      message: 'La categoría debe ser: Digital, Social, Contenido, Diseño, Desarrollo o Análisis'
    }
  },
  
  // Información comercial
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  
  // Duración estimada del proyecto/servicio
  duration: {
    type: String,
    required: [true, 'La duración es obligatoria'],
    maxlength: [50, 'La duración no puede exceder 50 caracteres']
  },
  
  // Estado operativo del servicio
  status: {
    type: String,
    required: true,
    enum: {
      values: ['Activo', 'Nuevo', 'Pausado', 'Inactivo'],
      message: 'El estado debe ser: Activo, Nuevo, Pausado o Inactivo'
    },
    default: 'Nuevo'
  },
  
  // Descripción detallada del servicio
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  
  // Métricas del servicio
  clients: {
    type: Number,
    default: 0,
    min: [0, 'El número de clientes no puede ser negativo']
  }
}, {
  // Configuraciones del esquema
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  versionKey: false // Remueve el campo __v de versioning
});

/**
 * Middleware pre-save para procesar datos antes de guardar
 */
serviceSchema.pre('save', function(next) {
  // Capitalizar la primera letra del nombre
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  next();
});

/**
 * Métodos virtuales para formateo de datos
 */
serviceSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toLocaleString()}`;
});

/**
 * Métodos de instancia
 */
serviceSchema.methods.toJSON = function() {
  const service = this.toObject();
  service.formattedPrice = this.formattedPrice;
  return service;
};

/**
 * Índices para optimización de consultas
 */
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

/**
 * Exporta el modelo Service
 * @module Service
 * @description Modelo de Mongoose para servicios de marketing de Virtyum
 */
module.exports = mongoose.model('Service', serviceSchema); 