/**
 * @fileoverview Rutas API para la gestión de servicios de marketing
 * @description Define todos los endpoints disponibles para operaciones CRUD de servicios
 * @author Virtyum Backend Team
 * @version 1.0.0
 * 
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - duration
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del servicio
 *         name:
 *           type: string
 *           description: Nombre del servicio
 *         category:
 *           type: string
 *           enum: [Digital, Social, Contenido, Diseño, Desarrollo, Análisis]
 *           description: Categoría del servicio
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Precio del servicio en USD
 *         duration:
 *           type: string
 *           description: Duración estimada del servicio
 *         status:
 *           type: string
 *           enum: [Activo, Nuevo, Pausado, Inactivo]
 *           description: Estado actual del servicio
 *         description:
 *           type: string
 *           description: Descripción detallada del servicio
 *         clients:
 *           type: number
 *           minimum: 0
 *           description: Número de clientes activos
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

/**
 * @swagger
 * /api/services/stats:
 *   get:
 *     summary: Obtiene estadísticas generales de servicios
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                 clients:
 *                   type: object
 *                 categories:
 *                   type: object
 *                 pricing:
 *                   type: object
 *       500:
 *         description: Error interno del servidor
 */
router.get('/stats', serviceController.getServiceStats);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Obtiene todos los servicios
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Crea un nuevo servicio
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - duration
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Email Marketing"
 *               category:
 *                 type: string
 *                 enum: [Digital, Social, Contenido, Diseño, Desarrollo, Análisis]
 *                 example: "Digital"
 *               price:
 *                 type: number
 *                 example: 399
 *               duration:
 *                 type: string
 *                 example: "Mensual"
 *               status:
 *                 type: string
 *                 enum: [Activo, Nuevo, Pausado, Inactivo]
 *                 example: "Nuevo"
 *               description:
 *                 type: string
 *                 example: "Campañas automatizadas de email marketing"
 *               clients:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', serviceController.createService);

/**
 * @swagger
 * /api/services/category/{category}:
 *   get:
 *     summary: Obtiene servicios por categoría
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Digital, Social, Contenido, Diseño, Desarrollo, Análisis]
 *         description: Categoría de servicios a filtrar
 *     responses:
 *       200:
 *         description: Servicios de la categoría obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                 count:
 *                   type: number
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       400:
 *         description: Categoría inválida
 *       500:
 *         description: Error interno del servidor
 */
router.get('/category/:category', serviceController.getServicesByCategory);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Obtiene un servicio específico por ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', serviceController.getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Actualiza un servicio existente
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Digital, Social, Contenido, Diseño, Desarrollo, Análisis]
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Activo, Nuevo, Pausado, Inactivo]
 *               description:
 *                 type: string
 *               clients:
 *                 type: number
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Error de validación o ID inválido
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', serviceController.updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Elimina un servicio
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio a eliminar
 *     responses:
 *       200:
 *         description: Servicio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedService:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', serviceController.deleteService);

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API para la gestión de servicios de marketing de Virtyum
 */

module.exports = router; 