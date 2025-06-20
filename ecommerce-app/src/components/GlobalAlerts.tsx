import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';

const GlobalAlerts: React.FC = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (    <div 
      className="position-fixed top-0 start-0 w-100 p-0" 
      style={{ 
        zIndex: 1050
      }}
    >
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          variant="success"
          className="mb-0 border-0 rounded-0 py-3"
          style={{
            background: 'rgba(25, 135, 84, 0.95)',
            color: 'white',
            backdropFilter: 'blur(4px)'
          }}
          onClose={() => removeAlert(alert.id)}
          dismissible
        >          <div className="container">
            <div className="d-flex align-items-center justify-content-center gap-2">
              {alert.message}
              {alert.link && (
                <Link to={alert.link.to} className="text-decoration-underline ms-1">
                  {alert.link.text}
                </Link>
              )}
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default GlobalAlerts;
