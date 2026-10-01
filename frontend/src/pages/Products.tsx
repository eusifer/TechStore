import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, PackageX } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts, fetchCategories } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

interface ProductsProps {
  initialCategory?: string;
  initialSearch?: string;
  onViewProductDetail: (product: Product) => void;
}

export const Products: React.FC<ProductsProps> = ({
  initialCategory = 'Todas',
  initialSearch = '',
  onViewProductDetail,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then((cats) => setCategories(['Todas', ...cats])).catch(() => {});
  }, []);

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    fetchProducts(searchQuery, selectedCategory)
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message || 'Error al conectar con la base de datos.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return a.id - b.id;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Filter Header Box */}
      <div className="bg-superficie border border-borde rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-texto-principal tracking-tight">
              Catálogo de Productos
            </h1>
            <p className="text-xs sm:text-sm text-texto-secundario mt-1">
              Explora nuestro catálogo tecnológico actualizado con stock garantizado.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por nombre o especificación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#DCE4DC] text-[#26352A] placeholder:text-[#6B756D] text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:bg-white focus:text-[#26352A] focus:border-[#5F7A61] focus:ring-1 focus:ring-[#5F7A61] font-medium transition-colors"
            />
            <Search className="w-4 h-4 text-texto-secundario absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Category Filter Pills & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-borde">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-verde-oscuro shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-verde-oscuro text-white shadow-sm'
                    : 'bg-fondo text-texto-principal hover:bg-salvia-light border border-borde'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-texto-secundario" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-[#DCE4DC] text-[#26352A] text-xs rounded-xl px-3 py-2 focus:outline-none focus:bg-white focus:text-[#26352A] focus:border-[#5F7A61] font-semibold transition-colors"
            >
              <option value="default">Ordenar por: Relevancia</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <LoadingSpinner message="Consultando productos en la base de datos PostgreSQL..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadProducts} />
      ) : sortedProducts.length === 0 ? (
        <div className="bg-superficie border border-borde rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-sm">
          <PackageX className="w-12 h-12 text-salvia mx-auto mb-3" />
          <h3 className="text-texto-principal font-bold text-lg mb-1">Sin resultados</h3>
          <p className="text-texto-secundario text-xs mb-4">
            No encontramos productos para la búsqueda "{searchQuery}" en "{selectedCategory}".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todas');
              setSearchQuery('');
              loadProducts();
            }}
            className="px-4 py-2 bg-verde-oscuro hover:bg-verde-oscuro-hover text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewProductDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
