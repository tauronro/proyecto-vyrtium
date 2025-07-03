import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, currentPage, setCurrentPage }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Main Content */}
      <div 
        className="main-content"
        style={{
          marginLeft: sidebarCollapsed ? '60px' : '250px',
          marginTop: '56px', // Height of navbar
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 56px)',
          padding: '20px'
        }}
      >
        <Container fluid>
          {children}
        </Container>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
          }
          .sidebar-expanded,
          .sidebar-collapsed {
            transform: translateX(-100%);
          }
          .sidebar-expanded.show,
          .sidebar-collapsed.show {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Layout; 