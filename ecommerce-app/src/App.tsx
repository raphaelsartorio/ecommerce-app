import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { AlertProvider } from './context/AlertContext';
import GlobalAlerts from './components/GlobalAlerts';
import Orders from './pages/Orders';
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <AlertProvider>
      <CartProvider>
        <Router>
          <MainLayout>
            <GlobalAlerts />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </MainLayout>
        </Router>
      </CartProvider>
    </AlertProvider>
  );
}

export default App;