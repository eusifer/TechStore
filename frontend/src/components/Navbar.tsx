import React from 'react';
import { ShoppingCart, Cpu, Search, Activity } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onSearchSubmit }) => {
  const { totalItems } = useCart();
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchInput);
      setActiveTab('products');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-verde-oscuro text-white shadow-sm border-b border-verde-oscuro/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-white hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-amarillo rounded-lg p-1"
          aria-label="Ir a Inicio - TechStore"
        >
          <div className="bg-salvia p-1.5 rounded-xl text-white shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight">TECH<span className="text-amarillo font-extrabold">STORE</span></span>
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative" role="search">
          <input
            type="text"
            placeholder="Buscar laptops, monitores, periféricos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-white border border-[#DCE4DC] text-[#26352A] placeholder:text-[#6B756D] text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:bg-white focus:text-[#26352A] focus:border-[#5F7A61] focus:ring-1 focus:ring-[#5F7A61] font-medium transition-colors"
            aria-label="Buscar productos"
          />
          <Search className="w-4 h-4 text-texto-secundario absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegación principal">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'bg-salvia text-white'
                : 'text-white/90 hover:bg-verde-oscuro-hover hover:text-white'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
              activeTab === 'products'
                ? 'bg-salvia text-white'
                : 'text-white/90 hover:bg-verde-oscuro-hover hover:text-white'
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-salvia text-white'
                : 'text-white/90 hover:bg-verde-oscuro-hover hover:text-white'
            }`}
            title="Panel de métricas y auditoría"
          >
            <Activity className="w-4 h-4 text-amarillo" />
            <span>Métricas</span>
          </button>

          {/* Cart Icon & Coral Badge */}
          <button
            onClick={() => setActiveTab('cart')}
            className="relative p-2.5 text-white hover:bg-verde-oscuro-hover rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amarillo"
            aria-label={`Ver carrito de compras, ${totalItems} artículos`}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-coral text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
