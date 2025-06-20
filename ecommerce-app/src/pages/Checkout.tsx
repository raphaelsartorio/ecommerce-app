import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { saveOrder } from '../api/orders';
import { FaSpinner } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

const Checkout = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [client, setClient] = useState({ name: '', email: '', address: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const total = cart.reduce((sum, item) => {
    const finalPrice = item.hasdIscount && item.discountValue 
      ? item.price - item.discountValue 
      : item.price;
    return sum + finalPrice * item.quantity;
  }, 0);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const now = new Date().toISOString();
      const order = {
        id: crypto.randomUUID(),
        client,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          provider: item.provider,
          quantity: item.quantity,
          category: item.category,
          departament: item.departament,
          material: item.material,
          discountValue: item.discountValue,
          hasdIscount: item.hasdIscount
        })),
        total,
        date: now,
        status: 'pending' as const,
        createdAt: now,
        updatedAt: now
      };

      await saveOrder(order);
      clearCart();
      setClient({ name: '', email: '', address: '' });
      setSubmitted(true);    } catch (error) {
      // Handle error silently
      // Aqui você pode adicionar uma notificação de erro para o usuário
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container className="py-4">
        <h1 className="fs-3 mb-4">Checkout</h1>
        <Alert variant="success">Pedido realizado com sucesso!</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="px-2 px-md-4">
      <h1 className="fs-3 mb-4 text-center text-md-start">Checkout</h1>
      {!showForm ? (
        <>
          <h2 className="fs-5 mb-3 text-center text-md-start">Seu Carrinho</h2>
          <div className="d-flex justify-content-center">
            <Row className="g-3 mb-4 w-100">
              {cart.length === 0 && <Col><Alert variant="info">Seu carrinho está vazio.</Alert></Col>}
              {cart.map(item => (
                <Col xs={12} sm={6} key={item.id} className="d-flex">
                  <Card className="h-100 w-100 shadow-sm">
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}>                      <Card.Img 
                        variant="top" 
                        src={item.image || '/no_image.jpg'} 
                        alt={item.name} 
                        style={{ height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/no_image.jpg';
                        }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="fs-6 mb-0">{item.name}</Card.Title>
                        <Badge
                          bg={item.provider === 'brazilian' ? 'success' : 'warning'}
                          text={item.provider === 'brazilian' ? 'white' : 'dark'}
                          className="text-uppercase ms-2"
                        >
                          {item.provider === 'brazilian' ? '🇧🇷 Brasileiro' : '🇪🇺 Europeu'}
                        </Badge>
                      </div>

                      <div className="small mb-2">
                        {item.category && (
                          <Badge bg="secondary" className="me-1">
                            {item.category}
                          </Badge>
                        )}
                        {item.departament && (
                          <Badge bg="info" className="me-1">
                            {item.departament}
                          </Badge>
                        )}
                        {item.material && (
                          <Badge bg="light" text="dark" className="me-1">
                            {item.material}
                          </Badge>
                        )}
                      </div>

                      <Card.Text className="small text-muted mb-3">
                        {item.description}
                      </Card.Text>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Quantidade: <b>{item.quantity}</b></span>
                          <div>
                            {item.hasdIscount && item.discountValue ? (
                              <div className="text-end">
                                <span className="text-decoration-line-through text-muted me-2">
                                  R$ {item.price.toFixed(2)}
                                </span>
                                <span className="fw-bold text-success">
                                  R$ {(item.price - item.discountValue).toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="fw-bold">
                                R$ {item.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => removeFromCart(item.id)} 
                          className="w-100"
                        >
                          Remover
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          {cart.length > 0 && (
            <div className="d-flex flex-column flex-sm-row align-items-end align-items-sm-center justify-content-sm-between gap-3 bg-light p-3 rounded shadow-sm" >
              <div className="text-center text-sm-start">
                <div className="text-muted mb-1">Total do pedido:</div>
                <div className="fw-bold fs-4">R$ {total.toFixed(2)}</div>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => setShowForm(true)} 
                className="w-100 w-sm-auto"
              >
                Finalizar Compra
              </Button>
            </div>
          )}
        </>
      ) : (
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <h2 className="fs-5 mb-3 text-center text-md-start">Dados do Cliente</h2>
            <Form onSubmit={handleSubmit} className="p-3 p-md-4 border rounded bg-white shadow-sm">
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control name="name" value={client.name} onChange={handleInput} required size="lg" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" value={client.email} onChange={handleInput} required size="lg" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control name="address" value={client.address} onChange={handleInput} required size="lg" />
              </Form.Group>
              <div className="text-center text-muted mb-3">
                Total a pagar: <span className="fw-bold fs-5">R$ {total.toFixed(2)}</span>
              </div>
              <Button type="submit" variant="primary" disabled={loading} className="w-100" size="lg">
                {loading ? <FaSpinner className="spin" /> : 'Finalizar Pedido'}
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Checkout;
