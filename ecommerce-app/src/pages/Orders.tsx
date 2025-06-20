import { useState, useEffect } from 'react';
import { getOrders } from '../api/orders';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Pagination from 'react-bootstrap/Pagination';
import type { Order } from '../types';

const Orders = () => {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 4;

  useEffect(() => {    const fetchOrders = async () => {
      try {        const data = await getOrders();
        const sortedOrders = [...data].sort((a: Order, b: Order) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setOrders(sortedOrders);      } catch (error) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Cálculo das páginas
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = page * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Container className="py-4"><p>Carregando pedidos...</p></Container>;
  if (orders.length === 0) return <Container className="py-4"><p>Nenhum pedido encontrado.</p></Container>;

  return (
    <Container className="py-3 px-2 px-sm-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h1 className="fs-3 mb-0">📦 Pedidos Realizados</h1>
          <span className="text-muted">({orders.length} pedidos)</span>
        </div>
      </div>
      
      <Row className="g-3 g-md-4">
        {currentOrders.map((order: any) => (
          <Col xs={12} lg={6} key={order.id} className="d-flex">
            <Card className="w-100 h-100 shadow-sm">
              <Card.Header className="bg-light">                
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fs-6">
                    <i className="bi bi-tag me-2"></i>
                    Pedido #{order.data.id}
                  </h5>
                  <span className="text-muted small">
                    {new Date(order.data.date).toLocaleDateString()}
                  </span>
                </div>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="mb-2">
                  <div className="mb-2">
                    <strong>Cliente:</strong> {order.data.client.name} <br />
                    <strong>Email:</strong> {order.data.client.email} <br />
                    <strong>Endereço:</strong> {order.data.client.address}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> <Badge bg={order.data.status === 'pending' ? 'warning' : 'success'}>{order.data.status}</Badge>
                  </div>
                  <div className="mb-2">
                    <strong>Total:</strong> <span className="fw-bold">R$ {order.data.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mb-3">
                  {order.data.items.map((item: any) => (
                    <Card key={item.id} className="mb-2 border-light">
                      <Card.Body className="p-2">
                        <div className="d-flex gap-3">                          
                          <div style={{ width: '80px', height: '80px' }}>
                            <img 
                              src={item.image || '/no_image.jpg'} 
                              alt={item.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              className="rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/no_image.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <h6 className="mb-0">{item.name}</h6>
                              <Badge
                                bg={item.provider === 'brazilian' ? 'success' : 'warning'}
                                text={item.provider === 'brazilian' ? 'white' : 'dark'}
                                className="text-uppercase ms-2"
                              >
                                {item.provider === 'brazilian' ? '🇧🇷 Brasileiro' : '🇪🇺 Europeu'}
                              </Badge>
                            </div>
                            <p className="small text-muted mb-2">{item.description}</p>
                            
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              {item.category && (
                                <Badge bg="secondary" className="small">
                                  {item.category}
                                </Badge>
                              )}
                              {item.departament && (
                                <Badge bg="info" className="small">
                                  {item.departament}
                                </Badge>
                              )}
                              {item.material && (
                                <Badge bg="light" text="dark" className="small border">
                                  {item.material}
                                </Badge>
                              )}
                            </div>

                            <div className="d-flex flex-wrap gap-2 align-items-center">
                              <Badge bg="primary" className="d-flex align-items-center gap-1">
                                <span>Quantidade: {item.quantity}</span>
                              </Badge>
                              <div className="d-flex align-items-center">
                                {item.hasdIscount && item.discountValue ? (
                                  <>
                                    <span className="text-decoration-line-through text-muted me-2">
                                      R$ {item.price.toFixed(2)}
                                    </span>
                                    <span className="fw-bold text-success">
                                      R$ {(item.price - item.discountValue).toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="fw-bold">
                                    R$ {item.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination size="lg">
            <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={page === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default Orders;
