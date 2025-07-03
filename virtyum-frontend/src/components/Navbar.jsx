import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const handleNavClick = (pageId, e) => {
    e.preventDefault();
    setCurrentPage(pageId);
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow">
      <Container fluid>
        <BootstrapNavbar.Brand 
          href="#" 
          onClick={(e) => handleNavClick('dashboard', e)}
          className="fw-bold"
        >
          <i className="bi bi-box me-2"></i>
          Virtyum
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              href="#"
              onClick={(e) => handleNavClick('dashboard', e)}
              className={currentPage === 'dashboard' ? 'active' : ''}
            >
              <i className="bi bi-house me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link 
              href="#"
              onClick={(e) => handleNavClick('products', e)}
              className={currentPage === 'products' ? 'active' : ''}
            >
              <i className="bi bi-box-seam me-1"></i>
              Productos
            </Nav.Link>
           
          </Nav>
          
          <Nav>
            <NavDropdown title={
              <span>
                <i className="bi bi-person-circle me-1"></i>
                Usuario
              </span>
            } id="basic-nav-dropdown" align="end">
              <NavDropdown.Item href="#profile">
                <i className="bi bi-person me-2"></i>
                Perfil
              </NavDropdown.Item>
            
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 