/**
 * @fileoverview Servicio API para la gestión de servicios de marketing
 * @description Centraliza todas las llamadas HTTP al backend para operaciones CRUD de servicios
 * @author Virtyum Frontend Team
 * @version 1.0.0
 */

import axios from 'axios';

/**
 * Configuración base de axios para la API
 * @constant {string} API_BASE_URL - URL base del backend
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Instancia configurada de axios para servicios
 * @constant {AxiosInstance} serviceApi - Cliente HTTP preconfigurado
 */
const serviceApi = axios.create({
  baseURL: `${API_BASE_URL}/services`,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


/**
 * Interceptor para responses - maneja errores globalmente
 */
serviceApi.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Manejo global de errores
    if (error.response?.status === 401) {
      // Manejar errores de autenticación
      console.log('🔐 Unauthorized - redirecting to login');
    } else if (error.response?.status >= 500) {
      // Errores del servidor
      console.log('🔥 Server Error - showing notification');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Clase principal para operaciones de servicios
 * @class ServiceAPI
 * @description Contiene todos los métodos para interactuar con el backend de servicios
 */
class ServiceAPI {
  
  /**
   * Obtiene todos los servicios de marketing
   * @async
   * @method getAllServices
   * @returns {Promise<Array>} Lista de servicios ordenados por fecha de creación
   * @throws {Error} Error en la petición HTTP
   * @example
   * const services = await ServiceAPI.getAllServices();
   * console.log(services); // [{ _id: '...', name: 'SEO', ... }]
   */
  static async getAllServices() {
    try {
      const response = await serviceApi.get('/');
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener servicios: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Crea un nuevo servicio de marketing
   * @async
   * @method createService
   * @param {Object} serviceData - Datos del servicio a crear
   * @param {string} serviceData.name - Nombre del servicio
   * @param {string} serviceData.category - Categoría del servicio
   * @param {number} serviceData.price - Precio del servicio
   * @param {string} serviceData.duration - Duración del servicio
   * @param {string} [serviceData.status='Nuevo'] - Estado del servicio
   * @param {string} serviceData.description - Descripción del servicio
   * @param {number} [serviceData.clients=0] - Número de clientes
   * @returns {Promise<Object>} Respuesta con el servicio creado
   * @throws {Error} Error en la petición HTTP o validación
   * @example
   * const newService = await ServiceAPI.createService({
   *   name: 'Email Marketing',
   *   category: 'Digital',
   *   price: 399,
   *   duration: 'Mensual',
   *   description: 'Campañas automatizadas'
   * });
   */
  static async createService(serviceData) {
    try {
      const response = await serviceApi.post('/', serviceData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
      }
      
      throw new Error(`Error al crear servicio: ${message}`);
    }
  }

  /**
   * Obtiene un servicio específico por su ID
   * @async
   * @method getServiceById
   * @param {string} serviceId - ID del servicio a buscar
   * @returns {Promise<Object>} Datos del servicio encontrado
   * @throws {Error} Error en la petición HTTP o servicio no encontrado
   * @example
   * const service = await ServiceAPI.getServiceById('507f1f77bcf86cd799439011');
   * console.log(service.name); // 'SEO & Posicionamiento Web'
   */
  static async getServiceById(serviceId) {
    try {
      if (!serviceId) {
        throw new Error('ID de servicio es requerido');
      }
      
      const response = await serviceApi.get(`/${serviceId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Servicio no encontrado');
      }
      
      throw new Error(`Error al obtener servicio: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Actualiza un servicio existente
   * @async
   * @method updateService
   * @param {string} serviceId - ID del servicio a actualizar
   * @param {Object} updateData - Datos a actualizar (campos opcionales)
   * @returns {Promise<Object>} Respuesta con el servicio actualizado
   * @throws {Error} Error en la petición HTTP o validación
   * @example
   * const updated = await ServiceAPI.updateService('507f...', {
   *   price: 599,
   *   status: 'Activo'
   * });
   */
  static async updateService(serviceId, updateData) {
    try {
      if (!serviceId) {
        throw new Error('ID de servicio es requerido');
      }
      
      const response = await serviceApi.put(`/${serviceId}`, updateData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Servicio no encontrado para actualizar');
      }
      
      const message = error.response?.data?.message || error.message;
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
      }
      
      throw new Error(`Error al actualizar servicio: ${message}`);
    }
  }

  /**
   * Elimina un servicio de la base de datos
   * @async
   * @method deleteService
   * @param {string} serviceId - ID del servicio a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   * @throws {Error} Error en la petición HTTP o servicio no encontrado
   * @example
   * const result = await ServiceAPI.deleteService('507f1f77bcf86cd799439011');
   * console.log(result.message); // 'Servicio eliminado correctamente'
   */
  static async deleteService(serviceId) {
    try {
      if (!serviceId) {
        throw new Error('ID de servicio es requerido');
      }
      
      const response = await serviceApi.delete(`/${serviceId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Servicio no encontrado para eliminar');
      }
      
      throw new Error(`Error al eliminar servicio: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Obtiene servicios filtrados por categoría
   * @async
   * @method getServicesByCategory
   * @param {string} category - Categoría a filtrar
   * @returns {Promise<Object>} Objeto con servicios de la categoría y metadatos
   * @throws {Error} Error en la petición HTTP o categoría inválida
   * @example
   * const result = await ServiceAPI.getServicesByCategory('Digital');
   * console.log(result.count); // 3
   * console.log(result.services); // [{ _id: '...', category: 'Digital', ... }]
   */
  static async getServicesByCategory(category) {
    try {
      if (!category) {
        throw new Error('Categoría es requerida');
      }
      
      const response = await serviceApi.get(`/category/${category}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        const validCategories = error.response?.data?.validCategories;
        throw new Error(`Categoría inválida. Categorías válidas: ${validCategories?.join(', ')}`);
      }
      
      throw new Error(`Error al obtener servicios por categoría: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Obtiene estadísticas generales de servicios
   * @async
   * @method getServiceStats
   * @returns {Promise<Object>} Estadísticas completas de servicios
   * @throws {Error} Error en la petición HTTP
   * @example
   * const stats = await ServiceAPI.getServiceStats();
   * console.log(stats.overview.totalServices); // 10
   * console.log(stats.clients.totalClients); // 473
   * console.log(stats.categories.availableCategories); // ['Digital', 'Social', ...]
   */
  static async getServiceStats() {
    try {
      const response = await serviceApi.get('/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Búsqueda avanzada de servicios (función helper para el frontend)
   * @async
   * @method searchServices
   * @param {Object} filters - Filtros de búsqueda
   * @param {string} [filters.searchTerm] - Término de búsqueda
   * @param {string} [filters.category] - Categoría específica
   * @param {string} [filters.status] - Estado específico
   * @returns {Promise<Array>} Servicios filtrados
   * @example
   * const results = await ServiceAPI.searchServices({
   *   searchTerm: 'marketing',
   *   category: 'Digital',
   *   status: 'Activo'
   * });
   */
  static async searchServices(filters = {}) {
    try {
      // Por ahora implementamos búsqueda en el frontend
      // En el futuro se puede mover al backend para mejor rendimiento
      const allServices = await this.getAllServices();
      
      return allServices.filter(service => {
        const matchesSearch = !filters.searchTerm || 
          service.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
          
        const matchesCategory = !filters.category || 
          filters.category === 'all' || 
          service.category === filters.category;
          
        const matchesStatus = !filters.status || 
          service.status === filters.status;
          
        return matchesSearch && matchesCategory && matchesStatus;
      });
    } catch (error) {
      throw new Error(`Error en búsqueda de servicios: ${error.message}`);
    }
  }
}

/**
 * Constantes para categorías válidas
 * @constant {Array<string>} VALID_CATEGORIES - Lista de categorías permitidas
 */
export const VALID_CATEGORIES = [
  'Digital',
  'Social', 
  'Contenido',
  'Diseño',
  'Desarrollo',
  'Análisis'
];

/**
 * Constantes para estados válidos
 * @constant {Array<string>} VALID_STATUSES - Lista de estados permitidos
 */
export const VALID_STATUSES = [
  'Activo',
  'Nuevo',
  'Pausado',
  'Inactivo'
];

/**
 * Utilidades para validación en el frontend
 * @class ServiceValidation
 */
export class ServiceValidation {
  /**
   * Valida datos de servicio antes de enviar al backend
   * @static
   * @method validateServiceData
   * @param {Object} serviceData - Datos a validar
   * @returns {Object} Resultado de validación
   * @example
   * const validation = ServiceValidation.validateServiceData(data);
   * if (!validation.isValid) {
   *   console.log(validation.errors);
   * }
   */
  static validateServiceData(serviceData) {
    const errors = [];
    
    if (!serviceData.name || serviceData.name.trim().length === 0) {
      errors.push('El nombre del servicio es obligatorio');
    }
    
    if (serviceData.name && serviceData.name.length > 100) {
      errors.push('El nombre no puede exceder 100 caracteres');
    }
    
    if (!serviceData.category || !VALID_CATEGORIES.includes(serviceData.category)) {
      errors.push(`La categoría debe ser una de: ${VALID_CATEGORIES.join(', ')}`);
    }
    
    if (!serviceData.price || serviceData.price < 0) {
      errors.push('El precio debe ser un número positivo');
    }
    
    if (!serviceData.duration || serviceData.duration.trim().length === 0) {
      errors.push('La duración es obligatoria');
    }
    
    if (!serviceData.description || serviceData.description.trim().length === 0) {
      errors.push('La descripción es obligatoria');
    }
    
    if (serviceData.description && serviceData.description.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }
    
    if (serviceData.status && !VALID_STATUSES.includes(serviceData.status)) {
      errors.push(`El estado debe ser uno de: ${VALID_STATUSES.join(', ')}`);
    }
    
    if (serviceData.clients && serviceData.clients < 0) {
      errors.push('El número de clientes no puede ser negativo');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Exportación por defecto de la clase principal
export default ServiceAPI;