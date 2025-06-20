import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAlert } from '../context/AlertContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addAlert } = useAlert();

  const handleAddToCart = () => {
    addToCart(product);
    addAlert({
      type: 'success',
      message: `${product.name} foi adicionado ao carrinho!`,
      link: {
        text: 'Ver carrinho',
        to: '/checkout'
      }
    });
  };

  return (
    <Card className="h-100 w-100 shadow-sm position-relative">
      <div className="bg-light d-flex align-items-center justify-content-center position-relative" style={{ minHeight: 180, maxHeight: 200 }}>        <Card.Img 
            variant="top" 
            src={product.image || '/no_image.jpg'} 
            alt={product.name} 
            className="w-100 h-100"
            style={{ objectFit: 'cover' }} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/no_image.jpg';
            }}
          />
      </div>
      <Card.Body className="d-flex flex-column p-2 p-sm-3">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="fs-6 mb-2">{product.name}</Card.Title>          <Badge
            bg={product.provider === 'brazilian' ? 'success' : 'warning'}
            className="text-uppercase small ms-2"
            text={product.provider === 'brazilian' ? 'white' : 'dark'}
          >
            {product.provider === 'brazilian' ? '🇧🇷 Brasileiro' : '🇪🇺 Europeu'}
          </Badge>
        </div>

        <div className="small mb-2">
          {product.category && (
            <Badge bg="secondary" className="me-1">
              {product.category}
            </Badge>
          )}
          {product.departament && (
            <Badge bg="info" className="me-1">
              {product.departament}
            </Badge>
          )}
          {product.material && (
            <Badge bg="light" text="dark" className="me-1">
              {product.material}
            </Badge>
          )}
        </div>

        <Card.Text className="small mb-2">{product.description}</Card.Text>

        <div className="mt-auto">
          {product.quantity !== undefined && (
            <div className="small text-muted mb-1">
              Estoque: {product.quantity} unidades
            </div>
          )}

          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2">
            <div className="d-flex flex-column">
              {product.hasdIscount && product.discountValue ? (
                <>
                  <span className="text-decoration-line-through text-muted small">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="fw-bold text-success">
                    R$ {(product.price - product.discountValue).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="fw-bold">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              {product.quantity === 0 ? 'Indisponível' : '+ Adicionar'}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
