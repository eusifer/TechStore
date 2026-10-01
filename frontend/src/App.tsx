import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Dashboard } from './pages/Dashboard';
import { Product, Order } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleNavigate = (tab: string, category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProductDetail = (product: Product) => {
    setSelectedProductId(product.id);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (order: Order) => {
    setCompletedOrder(order);
    setActiveTab('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => handleNavigate(tab)}
          onSearchSubmit={handleGlobalSearch}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {activeTab === 'home' && (
            <Home
              onNavigate={handleNavigate}
              onViewProductDetail={handleViewProductDetail}
            />
          )}

          {activeTab === 'products' && (
            <Products
              initialCategory={selectedCategory}
              initialSearch={searchQuery}
              onViewProductDetail={handleViewProductDetail}
            />
          )}

          {activeTab === 'product-detail' && selectedProductId && (
            <ProductDetail
              productId={selectedProductId}
              onBack={() => handleNavigate('products')}
              onNavigateToCart={() => handleNavigate('cart')}
            />
          )}

          {activeTab === 'cart' && (
            <Cart
              onNavigateToCheckout={() => handleNavigate('checkout')}
              onNavigateToProducts={() => handleNavigate('products')}
            />
          )}

          {activeTab === 'checkout' && (
            <Checkout
              onBackToCart={() => handleNavigate('cart')}
              onOrderCompleted={handleOrderCompleted}
            />
          )}

          {activeTab === 'order-confirmation' && completedOrder && (
            <OrderConfirmation
              order={completedOrder}
              onContinueShopping={() => handleNavigate('products')}
            />
          )}

          {activeTab === 'dashboard' && <Dashboard />}
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
