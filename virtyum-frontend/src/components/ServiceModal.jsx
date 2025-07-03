/**
 * @fileoverview Modal component para crear y editar servicios de marketing
 * @description Formulario modal con validación completa para gestión de servicios
 * @author Virtyum Frontend Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ServiceAPI, { VALID_CATEGORIES, VALID_STATUSES, ServiceValidation } from '../services/serviceApi';

/**
 * Modal para crear y editar servicios de marketing
 * @component ServiceModal
 * @param {Object} props - Props del componente
 * @param {boolean} props.show - Controla si el modal está visible
 * @param {Function} props.onHide - Función para cerrar el modal
 * @param {Function} props.onServiceCreated - Callback cuando se crea un servicio exitosamente
 * @param {Function} props.onServiceUpdated - Callback cuando se actualiza un servicio exitosamente
 * @param {Object|null} props.editingService - Servicio a editar (null para crear nuevo)
 * @returns {JSX.Element} Componente modal renderizado
 * 
 * @example
 * <ServiceModal
 *   show={showModal}
 *   onHide={() => setShowModal(false)}
 *   onServiceCreated={(newService) => {
 *     setServices([...services, newService.service]);
 *     setShowModal(false);
 *   }}
 *   editingService={null} // Para crear nuevo
 * />
 */
const ServiceModal = ({ 
  show, 
  onHide, 
  onServiceCreated, 
  onServiceUpdated, 
  editingService = null 
}) => {
  
  /**
   * Estado del formulario
   * @type {Object} formData - Datos del formulario
   */
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    status: 'Nuevo',
    description: '',
    clients: 0
  });

  /**
   * Estados de la UI
   */
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('danger');

  /**
   * Indica si estamos en modo edición
   * @type {boolean}
   */
  const isEditing = Boolean(editingService);

  /**
   * Efecto para cargar datos cuando se abre el modal para editar
   */
  useEffect(() => {
    if (isEditing && editingService) {
      setFormData({
        name: editingService.name || '',
        category: editingService.category || '',
        price: editingService.price || '',
        duration: editingService.duration || '',
        status: editingService.status || 'Nuevo',
        description: editingService.description || '',
        clients: editingService.clients || 0
      });
    } else {
      // Reset form for creating new service
      setFormData({
        name: '',
        category: '',
        price: '',
        duration: '',
        status: 'Nuevo',
        description: '',
        clients: 0
      });
    }
    
    // Limpiar errores al abrir/cambiar modal
    setErrors([]);
    setValidationErrors({});
    setShowAlert(false);
  }, [editingService, isEditing, show]);

  /**
   * Maneja cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convertir valores numéricos
    const processedValue = type === 'number' ? 
      (value === '' ? '' : Number(value)) : 
      value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpiar error específico del campo cuando el usuario empieza a escribir
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Valida el formulario antes de enviar
   * @returns {boolean} True si el formulario es válido
   */
  const validateForm = () => {
    const validation = ServiceValidation.validateServiceData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      showAlertMessage('Por favor corrige los errores en el formulario', 'danger');
      return false;
    }
    
    setErrors([]);
    return true;
  };

  /**
   * Muestra mensajes de alerta temporales
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de alerta (success, danger, warning, info)
   */
  const showAlertMessage = (message, type = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setShowAlert(false);

    try {
      if (isEditing) {
        // Actualizar servicio existente
        const response = await ServiceAPI.updateService(editingService._id, formData);
        showAlertMessage('Servicio actualizado exitosamente', 'success');
        
        // Callback para actualizar la lista en el componente padre
        if (onServiceUpdated) {
          onServiceUpdated(response);
        }
        
        // Cerrar modal después de un delay
        setTimeout(() => {
          onHide();
        }, 1500);
        
      } else {
        // Crear nuevo servicio
        const response = await ServiceAPI.createService(formData);
        showAlertMessage('Servicio creado exitosamente', 'success');
        
        // Callback para actualizar la lista en el componente padre
        if (onServiceCreated) {
          onServiceCreated(response);
        }
        
        // Cerrar modal después de un delay
        setTimeout(() => {
          onHide();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      showAlertMessage(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetea el formulario y cierra el modal
   */
  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      duration: '',
      status: 'Nuevo',
      description: '',
      clients: 0
    });
    setErrors([]);
    setValidationErrors({});
    setShowAlert(false);
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className={`bi bi-${isEditing ? 'pencil' : 'plus-circle'} me-2`}></i>
          {isEditing ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Alert para mensajes */}
          {showAlert && (
            <Alert 
              variant={alertType} 
              dismissible 
              onClose={() => setShowAlert(false)}
              className="mb-3"
            >
              <i className={`bi bi-${alertType === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
              {alertMessage}
            </Alert>
          )}

          {/* Lista de errores de validación */}
          {errors.length > 0 && (
            <Alert variant="danger" className="mb-3">
              <Alert.Heading>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Errores de Validación
              </Alert.Heading>
              <ul className="mb-0">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Row>
            {/* Nombre del servicio */}
            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>
                  Nombre del Servicio <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Email Marketing Avanzado"
                  maxLength={100}
                  required
                  disabled={loading}
                  isInvalid={validationErrors.name}
                />
                <Form.Text className="text-muted">
                  Máximo 100 caracteres
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Categoría */}
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>
                  Categoría <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  isInvalid={validationErrors.category}
                >
                  <option value="">Seleccionar categoría...</option>
                  {VALID_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Estado */}
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  {VALID_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Precio */}
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>
                  Precio (USD) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="399"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                  isInvalid={validationErrors.price}
                />
              </Form.Group>
            </Col>

            {/* Duración */}
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>
                  Duración <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Ej: Mensual, 2-3 semanas, Por proyecto"
                  maxLength={50}
                  required
                  disabled={loading}
                  isInvalid={validationErrors.duration}
                />
                <Form.Text className="text-muted">
                  Máximo 50 caracteres
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Número de clientes */}
            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>Número de Clientes</Form.Label>
                <Form.Control
                  type="number"
                  name="clients"
                  value={formData.clients}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Número actual de clientes que utilizan este servicio
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Descripción */}
            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>
                  Descripción <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe detalladamente el servicio, sus beneficios y características principales..."
                  maxLength={500}
                  required
                  disabled={loading}
                  isInvalid={validationErrors.description}
                />
                <Form.Text className="text-muted">
                  {formData.description.length}/500 caracteres
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {isEditing ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <i className={`bi bi-${isEditing ? 'check-lg' : 'plus-lg'} me-2`}></i>
                {isEditing ? 'Actualizar Servicio' : 'Crear Servicio'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ServiceModal; 