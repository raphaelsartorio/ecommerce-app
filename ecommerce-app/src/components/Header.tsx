import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';

const Header = () => {
  return (
    <Navbar bg="white" expand="md" className="shadow-sm px-4 py-2 mb-4 sticky-top">
      <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-primary">
        <span role="img" aria-label="Loja">🛍️</span> E-Shop
      </Navbar.Brand>
      <Form className="mx-auto w-50">
        <InputGroup>
          <Form.Control type="text" placeholder="Buscar produtos..." />
          <Button variant="outline-primary">Buscar</Button>
        </InputGroup>
      </Form>
      <Nav className="ms-auto d-flex align-items-center gap-3">
        <Nav.Link as={Link} to="/checkout">
          <i className="bi bi-cart" style={{ fontSize: 22 }}></i>
        </Nav.Link>
        <Nav.Link as={Link} to="/orders">
          <i className="bi bi-receipt" style={{ fontSize: 22 }}></i>
        </Nav.Link>
        <Button variant="light" className="rounded-circle p-2">
          <i className="bi bi-person"></i>
        </Button>
      </Nav>
    </Navbar>
  );
};

export default Header;
