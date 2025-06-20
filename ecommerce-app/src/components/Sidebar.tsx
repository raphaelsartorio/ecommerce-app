// src/components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const location = useLocation();
  const navItems = [
    { label: 'Produtos', path: '/', icon: '🏠' },
    { label: 'Carrinho', path: '/checkout', icon: '🛒' },
    { label: 'Pedidos', path: '/orders', icon: '📦' },
  ];

  return (
    <div
      className="sidebar-menu"
      style={{
        position: 'fixed',
        top: 0,
        left: collapsed ? '-280px' : '0',
        height: '100vh',
        zIndex: 1040,
        width: '280px',
        transition: 'left 0.3s ease',
        background: '#fff',
        borderRight: '1px solid #dee2e6',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
      }}
    >
      <Navbar bg="light" expand="md" className="flex-column align-items-start min-vh-100 p-3">
        <div className="w-100 d-flex justify-content-between align-items-center mb-4">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <span role="img" aria-label="Loja">🛍️</span>
            <span className="ms-2">Loja</span>
          </Navbar.Brand>
        </div>
        <Nav className="flex-column w-100 gap-2">
          {navItems.map(item => (
            <Nav.Link
              as={Link}
              to={item.path}
              key={item.path}
              active={location.pathname === item.path}
              className={`d-flex align-items-center ${location.pathname === item.path ? 'fw-bold text-primary' : ''}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              <span className="me-2">{item.icon}</span>
              <span>{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>
      </Navbar>
    </div>
  );
};

export default Sidebar;
