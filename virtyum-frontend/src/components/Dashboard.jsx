/**
 * @fileoverview Componente Dashboard con estadísticas en tiempo real
 * @description Dashboard principal que muestra estadísticas de servicios de marketing desde el backend
 * @author Virtyum Frontend Team
 * @version 2.0.0 - Conectado con backend de servicios
 */

import { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import ServiceAPI from '../services/serviceApi';

/**
 * Componente Dashboard principal
 * @component Dashboard
 * @description Muestra estadísticas en tiempo real de servicios de marketing
 * @returns {JSX.Element} Dashboard con métricas actualizadas
 */
const Dashboard = () => {
  // Estados para datos del backend
  const [stats, setStats] = useState({
    overview: { totalServices: 0, activeServices: 0, newServices: 0, pausedServices: 0 },
    clients: { totalClients: 0 },
    categories: { totalCategories: 0, availableCategories: [] },
    pricing: { averagePrice: 0, minPrice: 0, maxPrice: 0 }
  });

  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carga las estadísticas y servicios recientes desde el backend
   * @async
   * @function loadDashboardData
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, servicesData] = await Promise.all([
        ServiceAPI.getServiceStats(),
        ServiceAPI.getAllServices()
      ]);
      
      setStats(statsData);
      // Tomar los 5 servicios más recientes
      setRecentServices(servicesData.slice(0, 5));
      
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Efecto para cargar datos al montar el componente
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Configuración de las cards de estadísticas principales
   */
  const getStatsCards = () => [
    {
      title: 'Total Servicios',
      value: loading ? <Spinner animation="border" size="sm" /> : stats.overview.totalServices,
      icon: 'bi-briefcase',
      color: 'primary',
      description: 'Servicios registrados'
    },
    {
      title: 'Servicios Activos',
      value: loading ? <Spinner animation="border" size="sm" /> : stats.overview.activeServices,
      icon: 'bi-check-circle',
      color: 'success',
      description: 'En funcionamiento'
    },
    {
      title: 'Clientes Totales',
      value: loading ? <Spinner animation="border" size="sm" /> : stats.clients.totalClients,
      icon: 'bi-people',
      color: 'info',
      description: 'Clientes atendidos'
    },
    {
      title: 'Precio Promedio',
      value: loading ? <Spinner animation="border" size="sm" /> : `$${stats.pricing.averagePrice.toLocaleString()}`,
      icon: 'bi-currency-dollar',
      color: 'warning',
      description: 'Valor promedio'
    }
  ];

  /**
   * Obtiene el badge de estado para servicios
   * @param {string} status - Estado del servicio
   * @returns {JSX.Element} Badge con color apropiado
   */
  const getStatusBadge = (status) => {
    const variants = {
      'Activo': 'success',
      'Nuevo': 'primary',
      'Pausado': 'warning',
      'Inactivo': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'} className="fs-7">{status}</Badge>;
  };

  /**
   * Formatea la fecha de creación de servicios
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Dashboard</h1>
          <p className="text-muted mb-0">Bienvenido de vuelta, aquí tienes un resumen de tus servicios de marketing</p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg={error ? 'danger' : 'success'} className="fs-6">
            {error ? 'Error de conexión' : 'En línea'}
          </Badge>
          {error && (
            <Button variant="outline-primary" size="sm" onClick={loadDashboardData}>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Recargar
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error al cargar datos del dashboard
          </Alert.Heading>
          <p className="mb-2">{error}</p>
          <Button variant="outline-danger" size="sm" onClick={loadDashboardData}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Reintentar
          </Button>
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        {getStatsCards().map((stat, index) => (
          <Col key={index} xl={3} lg={6} md={6} sm={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-3 me-3`}>
                    <i className={`bi ${stat.icon} fs-4 text-${stat.color}`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">{stat.title}</h6>
                    <h4 className="mb-0">{stat.value}</h4>
                    <small className="text-muted">
                      {stat.description}
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Additional Stats Row */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-info bg-opacity-10 p-3 rounded-3 d-inline-flex mb-2">
                <i className="bi bi-tags fs-4 text-info"></i>
              </div>
              <h5 className="mb-1">
                {loading ? <Spinner animation="border" size="sm" /> : stats.categories.totalCategories}
              </h5>
              <small className="text-muted">Categorías Disponibles</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-3 d-inline-flex mb-2">
                <i className="bi bi-plus-circle fs-4 text-primary"></i>
              </div>
              <h5 className="mb-1">
                {loading ? <Spinner animation="border" size="sm" /> : stats.overview.newServices}
              </h5>
              <small className="text-muted">Servicios Nuevos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-3 d-inline-flex mb-2">
                <i className="bi bi-currency-dollar fs-4 text-success"></i>
              </div>
              <h5 className="mb-1">
                {loading ? <Spinner animation="border" size="sm" /> : `$${stats.pricing.maxPrice.toLocaleString()}`}
              </h5>
              <small className="text-muted">Precio Máximo</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded-3 d-inline-flex mb-2">
                <i className="bi bi-currency-dollar fs-4 text-warning"></i>
              </div>
              <h5 className="mb-1">
                {loading ? <Spinner animation="border" size="sm" /> : `$${stats.pricing.minPrice.toLocaleString()}`}
              </h5>
              <small className="text-muted">Precio Mínimo</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Content Cards */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Servicios Recientes</h5>
                {loading && <Spinner animation="border" size="sm" />}
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" className="me-2" />
                  Cargando servicios...
                </div>
              ) : recentServices.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox display-6 d-block mb-2"></i>
                  <p className="mb-0">No hay servicios disponibles</p>
                  <small>Los servicios recientes aparecerán aquí</small>
                </div>
              ) : (
                recentServices.map((service, index) => (
                  <div key={service._id} className={`d-flex align-items-center py-3 ${index < recentServices.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                      <i className="bi bi-briefcase text-primary"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className="mb-0">{service.name}</h6>
                        {getStatusBadge(service.status)}
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <small className="text-muted">
                          <i className="bi bi-tag me-1"></i>
                          {service.category}
                        </small>
                        <small className="text-success">
                          <i className="bi bi-currency-dollar me-1"></i>
                          ${service.price.toLocaleString()}
                        </small>
                        <small className="text-muted">
                          <i className="bi bi-people me-1"></i>
                          {service.clients} clientes
                        </small>
                      </div>
                    </div>
                    <small className="text-muted">
                      {service.createdAt ? formatDate(service.createdAt) : 'Reciente'}
                    </small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Categorías de Servicios</h5>
                {loading && <Spinner animation="border" size="sm" />}
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Cargando...
                </div>
              ) : stats.categories.availableCategories.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-tags display-6 d-block mb-2"></i>
                  <p className="mb-0">No hay categorías</p>
                </div>
              ) : (
                stats.categories.availableCategories.map((category, index) => {
                  const categoryIcons = {
                    'Digital': 'bi-laptop',
                    'Social': 'bi-chat-dots',
                    'Contenido': 'bi-file-text',
                    'Diseño': 'bi-palette',
                    'Desarrollo': 'bi-code-slash',
                    'Análisis': 'bi-graph-up'
                  };
                  
                  const categoryColors = {
                    'Digital': 'primary',
                    'Social': 'info',
                    'Contenido': 'warning',
                    'Diseño': 'success',
                    'Desarrollo': 'danger',
                    'Análisis': 'dark'
                  };

                  return (
                    <div key={category} className={`d-flex align-items-center py-2 ${index < stats.categories.availableCategories.length - 1 ? 'border-bottom' : ''}`}>
                      <div className="me-3">
                        <div className={`bg-${categoryColors[category] || 'secondary'} bg-opacity-10 p-2 rounded`} style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <i className={`bi ${categoryIcons[category] || 'bi-tag'} text-${categoryColors[category] || 'secondary'}`}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fs-6">{category}</h6>
                        <small className="text-muted">
                          {recentServices.filter(s => s.category === category).length} servicios
                        </small>
                      </div>
                    </div>
                  );
                })
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 