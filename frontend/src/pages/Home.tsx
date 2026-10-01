import React, { useEffect, useState } from 'react';
import { ArrowRight, Laptop, Monitor, Keyboard, Headphones, Printer, Mouse, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface HomeProps {
  onNavigate: (tab: string, category?: string) => void;
  onViewProductDetail: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onViewProductDetail }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setFeaturedProducts(data.slice(0, 8));
      })
      .catch((err) => console.error('Error fetching featured products:', err))
      .finally(() => setLoading(false));
  }, []);

  const categoryCards = [
    { name: 'Laptops', icon: Laptop, badge: 'Nuevos modelos' },
    { name: 'Monitores', icon: Monitor, badge: '4K & Curvos' },
    { name: 'Teclados', icon: Keyboard, badge: 'Mecánicos' },
    { name: 'Mouse', icon: Mouse, badge: 'Ergonómicos' },
    { name: 'Auriculares', icon: Headphones, badge: 'Noise Cancelling' },
    { name: 'Impresoras', icon: Printer, badge: 'Multifuncionales' },
  ];

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-verde-oscuro text-white p-8 sm:p-12 lg:p-14 shadow-sm border border-verde-oscuro/40">
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-salvia/40 text-amarillo text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tecnología + Frescura + Confianza</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Tu tienda tecnológica de <br />
            <span className="text-amarillo">confianza y alto rendimiento.</span>
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Descubre nuestra cuidada selección de equipos informáticos, periféricos y accesorios con soporte especializado y garantía directa.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3.5 rounded-xl bg-coral hover:bg-coral-hover text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-salvia hover:bg-salvia-dark text-white font-bold text-sm transition-all"
            >
              Ver Métricas & Auditoría
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-superficie border border-borde p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-salvia-light text-verde-oscuro">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-texto-principal">Envíos Rápidos</h4>
            <p className="text-[11px] text-texto-secundario">Despachos asegurados en 24/48h</p>
          </div>
        </div>

        <div className="bg-superficie border border-borde p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-coral-light text-coral">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-texto-principal">Garantía Directa</h4>
            <p className="text-[11px] text-texto-secundario">Respaldada por fabricantes</p>
          </div>
        </div>

        <div className="bg-superficie border border-borde p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-amarillo-light text-texto-principal">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-texto-principal">Soporte Humano</h4>
            <p className="text-[11px] text-texto-secundario">Asesoramiento pre y post venta</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-texto-principal tracking-tight">Categorías Destacadas</h2>
            <p className="text-xs text-texto-secundario">Encuentra exactamente lo que necesitas para tu oficina o gaming setup</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs text-salvia hover:text-verde-oscuro font-bold flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onNavigate('products', cat.name)}
                className="group bg-superficie hover:bg-salvia-light border border-borde hover:border-salvia rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center gap-2.5 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-fondo group-hover:bg-verde-oscuro flex items-center justify-center text-verde-oscuro group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-texto-principal block group-hover:text-verde-oscuro">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-texto-secundario font-medium">{cat.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-texto-principal tracking-tight">Catálogo Destacado</h2>
            <p className="text-xs text-texto-secundario">Los productos con mayor demanda e inventario disponible</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs text-salvia hover:text-verde-oscuro font-bold flex items-center gap-1"
          >
            Explorar catálogo completo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Cargando catálogo destacado..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={onViewProductDetail}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
