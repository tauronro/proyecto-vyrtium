import { useState } from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = ({ isCollapsed, setIsCollapsed, currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'bi-house', label: 'Dashboard' },
    { id: 'products', icon: 'bi-box-seam', label: 'Productos' },
  ];

  const handleNavClick = (pageId, e) => {
    e.preventDefault();
    setCurrentPage(pageId);
  };

  return (
    <div 
      className={`bg-dark text-white position-fixed d-flex flex-column ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      style={{
        top: '56px', // Height of navbar
        left: 0,
        height: 'calc(100vh - 56px)',
        width: isCollapsed ? '60px' : '250px',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        overflowX: 'hidden'
      }}
    >
      {/* Toggle Button */}
      <div className="p-2 border-bottom border-secondary">
        <button
          className="btn btn-outline-light btn-sm w-100"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ minHeight: '38px' }}
        >
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          {!isCollapsed && <span className="ms-2">Colapsar</span>}
        </button>
      </div>

      {/* Navigation Menu */}
      <Nav className="flex-column py-2 flex-grow-1">
        {menuItems.map((item, index) => (
          <Nav.Item key={index}>
            <Nav.Link 
              href="#"
              onClick={(e) => handleNavClick(item.id, e)}
              className={`text-white px-3 py-3 d-flex align-items-center sidebar-link ${
                currentPage === item.id ? 'active bg-primary bg-opacity-20' : ''
              }`}
              style={{
                borderRadius: 0,
                transition: 'all 0.2s ease',
                borderLeft: currentPage === item.id ? '3px solid #0d6efd' : '3px solid transparent'
              }}
            >
              <i className={`bi ${item.icon} fs-5`} style={{ minWidth: '20px' }}></i>
              {!isCollapsed && <span className="ms-3">{item.label}</span>}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Footer */}
      <div className="p-3 border-top border-secondary text-center">
        {!isCollapsed && (
          <small className="text-muted">
            Virtyum v1.0
          </small>
        )}
      </div>

      <style jsx>{`
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          transform: translateX(5px);
        }
        .sidebar-link.active:hover {
          transform: translateX(0);
        }
        .sidebar-expanded {
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Sidebar; 