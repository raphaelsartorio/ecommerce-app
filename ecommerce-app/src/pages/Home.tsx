// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../api/products';
import type { Product } from '../types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Pagination from 'react-bootstrap/Pagination';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [department, setDepartment] = useState('all');
  const [material, setMaterial] = useState('all');
  const [sort, setSort] = useState<'asc' | 'desc' | 'discount'>('asc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  // Get unique departments and materials
  const departments = ['all', ...new Set(products.map(p => p.departament))];
  const materials = ['all', ...new Set(products.map(p => p.material).filter(Boolean))];

  const filtered = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || p.provider === category;
      const matchesDepartment = department === 'all' || p.departament === department;
      const matchesMaterial = material === 'all' || p.material === material;
      return matchesSearch && matchesCategory && matchesDepartment && matchesMaterial;
    })
    .sort((a, b) => {
      if (sort === 'asc') return a.price - b.price;
      if (sort === 'desc') return b.price - a.price;
      // Ordenação por desconto: produtos com desconto primeiro
      if (sort === 'discount') {
        if (a.hasdIscount && !b.hasdIscount) return -1;
        if (!a.hasdIscount && b.hasdIscount) return 1;
        return b.discountValue || 0 - (a.discountValue || 0); // Maior desconto primeiro
      }
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    setPage(1); // Reset page when filters change
  }, [search, category, department, material, sort]);

  return (
    <>
      <Container fluid className="px-2 px-md-3 px-lg-4">
        <h1 className="fs-4 fw-semibold mb-4 text-center text-md-start">Catálogo de Produtos</h1>
        <Row className="mb-4 g-2 g-md-3 align-items-end flex-column flex-md-row">
          <Col xs={12} md={4} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="🔍 Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
            />
          </Col>          
          <Col xs={12} md={2} className="mb-2 mb-md-0">
            <Form.Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              size="lg"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'Todos os Departamentos' : dept}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={2} className="mb-2 mb-md-0">
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="lg"
            >
              <option value="all">Todas as categorias</option>
              <option value="brazilian">Brasileira</option>
              <option value="european">Europeia</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={2} className="mb-2 mb-md-0">
            <Form.Select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              size="lg"
            >
              {materials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat === 'all' ? 'Todos os Materiais' : mat}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={2}>            
          <Form.Select
              value={sort}
              onChange={e => setSort(e.target.value as 'asc' | 'desc' | 'discount')}
              size="lg"
            >
              <option value="asc">Mais barato primeiro</option>
              <option value="desc">Mais caro primeiro</option>
              <option value="discount">Com desconto primeiro</option>
            </Form.Select>
          </Col>
        </Row>
        <Row xs={1} sm={2} md={3} xl={4} className="g-2 g-md-3">
          {paginated.map((product) => (
            <Col key={product.id} className="d-flex">
              <ProductCard product={product} />
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
    </>
  );
};

export default Home;
