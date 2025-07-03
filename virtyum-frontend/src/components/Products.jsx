/**
 * @fileoverview Componente principal para la gestión de servicios de marketing
 * @description Interfaz completa para listar, crear, editar y eliminar servicios conectada al backend
 * @author Virtyum Frontend Team
 * @version 2.0.0 - Conectado con backend
 */

import { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Row, Col, Dropdown, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import ServiceAPI from '../services/serviceApi';
import ServiceModal from './ServiceModal';

/**
 * Componente principal para gestión de servicios de marketing
 * @component Products
 * @description Permite listar, crear, editar y eliminar servicios conectados al backend
 * @returns {JSX.Element} Interfaz completa de gestión de servicios
 */
const Products = () => {
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Estados para datos del backend
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({
    overview: { totalServices: 0, activeServices: 0 },
    clients: { totalClients: 0 },
    categories: { totalCategories: 0, availableCategories: [] }
  });

  // Estados para UI y loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Estados para notificaciones
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  /**
   * Muestra notificaciones toast temporales
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación (success, error, info)
   */
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  /**
   * Carga todos los servicios desde el backend
   * @async
   * @function loadServices
   */
  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [servicesData, statsData] = await Promise.all([
        ServiceAPI.getAllServices(),
        ServiceAPI.getServiceStats()
      ]);
      
      setServices(servicesData);
      setStats(statsData);
      
    } catch (err) {
      console.error('Error al cargar servicios:', err);
      setError(err.message);
      showNotification(`Error al cargar servicios: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Efecto para cargar datos al montar el componente
   */
  useEffect(() => {
    loadServices();
  }, []);

  // Datos estáticos originales (para fallback o comparación)
  const fallbackServices = [
    {
      id: 1,
      name: 'SEO & Posicionamiento Web',
      category: 'Digital',
      price: '$899',
      duration: '3-6 meses',
      status: 'Activo',
      description: 'Optimización completa para motores de búsqueda',
      clients: 45
    },
    {
      id: 2,
      name: 'Social Media Marketing',
      category: 'Social',
      price: '$599',
      duration: 'Mensual',
      status: 'Activo',
      description: 'Gestión completa de redes sociales',
      clients: 78
    },
    {
      id: 3,
      name: 'Google Ads & PPC',
      category: 'Digital',
      price: '$1,299',
      duration: 'Mensual',
      status: 'Activo',
      description: 'Campañas publicitarias en Google y redes',
      clients: 34
    },
    {
      id: 4,
      name: 'Content Marketing',
      category: 'Contenido',
      price: '$799',
      duration: 'Mensual',
      status: 'Activo',
      description: 'Creación de contenido estratégico',
      clients: 56
    },
    {
      id: 5,
      name: 'Email Marketing',
      category: 'Digital',
      price: '$399',
      duration: 'Mensual',
      status: 'Activo',
      description: 'Campañas automatizadas de email',
      clients: 89
    },
    {
      id: 6,
      name: 'Diseño Gráfico & Branding',
      category: 'Diseño',
      price: '$1,199',
      duration: '2-4 semanas',
      status: 'Activo',
      description: 'Identidad visual y materiales gráficos',
      clients: 67
    },
    {
      id: 7,
      name: 'Desarrollo Web',
      category: 'Desarrollo',
      price: '$2,499',
      duration: '4-8 semanas',
      status: 'Activo',
      description: 'Sitios web profesionales y e-commerce',
      clients: 23
    },
    {
      id: 8,
      name: 'Marketing Analytics',
      category: 'Análisis',
      price: '$699',
      duration: 'Mensual',
      status: 'Activo',
      description: 'Análisis y reportes de rendimiento',
      clients: 41
    },
    {
      id: 9,
      name: 'Influencer Marketing',
      category: 'Social',
      price: '$1,599',
      duration: 'Por campaña',
      status: 'Nuevo',
      description: 'Colaboraciones con influencers',
      clients: 12
    },
    {
      id: 10,
      name: 'Video Marketing',
      category: 'Contenido',
      price: '$1,899',
      duration: '2-3 semanas',
      status: 'Activo',
      description: 'Producción de videos publicitarios',
      clients: 28
    }
  ];

  /**
   * Maneja la creación exitosa de un nuevo servicio
   * @param {Object} response - Respuesta del backend con el servicio creado
   */
  const handleServiceCreated = async (response) => {
    try {
      // Recargar servicios y estadísticas
      await loadServices();
      setShowModal(false);
      showNotification('Servicio creado exitosamente');
    } catch (err) {
      showNotification(`Error al actualizar la lista: ${err.message}`, 'error');
    }
  };

  /**
   * Maneja la actualización exitosa de un servicio
   * @param {Object} response - Respuesta del backend con el servicio actualizado
   */
  const handleServiceUpdated = async (response) => {
    try {
      await loadServices();
      setShowModal(false);
      setEditingService(null);
      showNotification('Servicio actualizado exitosamente');
    } catch (err) {
      showNotification(`Error al actualizar la lista: ${err.message}`, 'error');
    }
  };

  /**
   * Abre el modal para crear un nuevo servicio
   */
  const handleCreateNew = () => {
    setEditingService(null);
    setShowModal(true);
  };

  /**
   * Abre el modal para editar un servicio existente
   * @param {Object} service - Servicio a editar
   */
  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  /**
   * Elimina un servicio después de confirmación
   * @param {string} serviceId - ID del servicio a eliminar
   * @param {string} serviceName - Nombre del servicio para confirmación
   */
  const handleDelete = async (serviceId, serviceName) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el servicio "${serviceName}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await ServiceAPI.deleteService(serviceId);
      await loadServices();
      showNotification(`Servicio "${serviceName}" eliminado exitosamente`);
    } catch (err) {
      showNotification(`Error al eliminar servicio: ${err.message}`, 'error');
    }
  };

  /**
   * Duplica un servicio existente
   * @param {Object} service - Servicio a duplicar
   */
  const handleDuplicate = (service) => {
    const duplicatedService = {
      ...service,
      name: `${service.name} (Copia)`,
      clients: 0,
      status: 'Nuevo'
    };
    
    // Remover campos que no necesitamos para la duplicación
    delete duplicatedService._id;
    delete duplicatedService.createdAt;
    delete duplicatedService.updatedAt;
    
    setEditingService(duplicatedService);
    setShowModal(true);
  };

  // Filtrar servicios (usando datos del backend o fallback)
  const currentServices = loading ? [] : (services.length > 0 ? services : fallbackServices);
  
  const filteredServices = currentServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas (del backend o fallback)
  const categories = stats.categories.availableCategories.length > 0 
    ? stats.categories.availableCategories 
    : [...new Set(currentServices.map(service => service.category))];

  const getStatusBadge = (status) => {
    const variants = {
      'Activo': 'success',
      'Nuevo': 'primary',
      'Pausado': 'warning',
      'Inactivo': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Digital': 'primary',
      'Social': 'info',
      'Contenido': 'warning',
      'Diseño': 'success',
      'Desarrollo': 'danger',
      'Análisis': 'dark'
    };
    return colors[category] || 'secondary';
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Servicios de Marketing</h1>
          <p className="text-muted mb-0">Gestiona todos los servicios que ofrece Virtyum</p>
        </div>
        <Button variant="primary" onClick={handleCreateNew} disabled={loading}>
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Servicio
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
           
          </Row>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error al cargar datos
          </Alert.Heading>
          <p className="mb-2">{error}</p>
          <Button variant="outline-danger" size="sm" onClick={loadServices}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Reintentar
          </Button>
        </Alert>
      )}

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              {loading ? (
                <Spinner animation="border" size="sm" className="text-primary mb-1" />
              ) : (
                <h4 className="text-primary mb-1">{stats.overview.totalServices}</h4>
              )}
              <small className="text-muted">Total Servicios</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              {loading ? (
                <Spinner animation="border" size="sm" className="text-success mb-1" />
              ) : (
                <h4 className="text-success mb-1">{stats.overview.activeServices}</h4>
              )}
              <small className="text-muted">Servicios Activos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              {loading ? (
                <Spinner animation="border" size="sm" className="text-info mb-1" />
              ) : (
                <h4 className="text-info mb-1">{stats.clients.totalClients}</h4>
              )}
              <small className="text-muted">Clientes Totales</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              {loading ? (
                <Spinner animation="border" size="sm" className="text-warning mb-1" />
              ) : (
                <h4 className="text-warning mb-1">{stats.categories.totalCategories}</h4>
              )}
              <small className="text-muted">Categorías</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Services Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Lista de Servicios</h5>
            <small className="text-muted">{filteredServices.length} servicios encontrados</small>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {/* Contenedor con altura fija y scroll */}
          <div className="table-responsive table-scroll-container">
            <Table hover className="mb-0">
              <thead className="bg-light table-sticky-header">
                <tr>
                  <th className="border-0 ps-4">Servicio</th>
                  <th className="border-0">Categoría</th>
                  <th className="border-0">Precio</th>
                  <th className="border-0">Duración</th>
                  <th className="border-0">Clientes</th>
                  <th className="border-0">Estado</th>
                  <th className="border-0 pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <Spinner animation="border" className="me-2" />
                      Cargando servicios...
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      <i className="bi bi-inbox display-4 d-block mb-2"></i>
                      {searchTerm || categoryFilter !== 'all' 
                        ? 'No se encontraron servicios con los filtros aplicados'
                        : 'No hay servicios disponibles'
                      }
                      {!searchTerm && categoryFilter === 'all' && (
                        <div className="mt-2">
                          <Button variant="primary" size="sm" onClick={handleCreateNew}>
                            <i className="bi bi-plus-lg me-1"></i>
                            Crear primer servicio
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service._id || service.id}>
                      <td className="ps-4">
                        <div>
                          <h6 className="mb-1">{service.name}</h6>
                          <small className="text-muted">{service.description}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getCategoryColor(service.category)} className="bg-opacity-10" text={getCategoryColor(service.category)}>
                          {service.category}
                        </Badge>
                      </td>
                      <td>
                        <strong className="text-success">
                          {typeof service.price === 'number' 
                            ? `$${service.price.toLocaleString()}` 
                            : service.price
                          }
                        </strong>
                      </td>
                      <td className="text-muted">{service.duration}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-people me-1 text-muted"></i>
                          {service.clients}
                        </div>
                      </td>
                      <td>{getStatusBadge(service.status)}</td>
                      <td className="pe-4">
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm" className="border-0">
                            <i className="bi bi-three-dots"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleEdit(service)}>
                              <i className="bi bi-pencil me-2"></i>Editar
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              onClick={() => handleDelete(service._id || service.id, service.name)}
                              className="text-danger"
                            >
                              <i className="bi bi-trash me-2"></i>Eliminar
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal para crear/editar servicios */}
      <ServiceModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingService(null);
        }}
        onServiceCreated={handleServiceCreated}
        onServiceUpdated={handleServiceUpdated}
        editingService={editingService}
      />

      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          autohide 
          delay={4000}
          bg={toastType === 'error' ? 'danger' : 'success'}
        >
          <Toast.Header closeButton={false}>
            <i className={`bi bi-${toastType === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
            <strong className="me-auto">
              {toastType === 'error' ? 'Error' : 'Éxito'}
            </strong>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-white"
              onClick={() => setShowToast(false)}
            >
              <i className="bi bi-x"></i>
            </Button>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Products; 