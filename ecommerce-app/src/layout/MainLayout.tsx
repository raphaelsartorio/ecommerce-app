import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-vh-100 min-vw-100 d-flex">
      <Button
        variant="outline-secondary"
        className="position-fixed z-3 d-flex align-items-center justify-content-center"
        style={{ 
          left: sidebarOpen ? '290px' : '1rem', 
          top: '1rem',
          width: '40px',
          height: '40px',
          padding: 0,
          transition: 'left 0.3s ease'
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu lateral"
      >
        {sidebarOpen ? '←' : '☰'}
      </Button>

      <Sidebar collapsed={!sidebarOpen} />

      <main className="flex-grow-1" style={{ 
        marginLeft: sidebarOpen ? '280px' : '0',
        padding: '4rem 1rem 1rem 1rem',
        width: '100%',
        transition: 'margin-left 0.3s ease'
      }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
