import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Check, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
  onNavigateToCart: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';

export const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  onBack,
  onNavigateToCart,
}) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_IMAGE);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductById(productId)
      .then((data) => {
        setProduct(data);
        setImgSrc(data.image_url || FALLBACK_IMAGE);
      })
      .catch((err) => setError(err.message || 'Error al cargar los detalles del producto.'))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return <LoadingSpinner message="Cargando especificaciones del producto..." />;
  }

  if (error || !product) {
    return <ErrorMessage message={error || 'Producto no encontrado.'} onRetry={onBack} />;
  }

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-superficie hover:bg-salvia-light text-texto-principal text-xs font-bold border border-borde transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 text-verde-oscuro" />
        <span>Volver al Catálogo</span>
      </button>

      {/* Main Detail Container */}
      <div className="bg-superficie border border-borde rounded-3xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 shadow-sm">
        {/* 1. Product Image */}
        <div className="relative aspect-square rounded-2xl bg-fondo overflow-hidden border border-borde flex items-center justify-center p-4">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Information Hierarchy */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* 3. Category */}
            <span className="inline-block bg-salvia-light text-verde-oscuro border border-salvia/40 text-xs font-bold px-3 py-1 rounded-full">
              {product.category}
            </span>

            {/* 2. Product Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-texto-principal tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* 4. Price & 5. Stock */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-3xl font-black text-texto-principal tracking-tight">
                S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isOutOfStock
                    ? 'bg-coral text-white'
                    : product.stock < 5
                    ? 'bg-amarillo-light text-texto-principal border border-amarillo'
                    : 'bg-salvia-light text-verde-oscuro border border-salvia'
                }`}
              >
                {isOutOfStock ? 'Agotado' : `Stock disponible: ${product.stock} unidades`}
              </span>
            </div>

            {/* 6. Description */}
            <div className="pt-3 border-t border-borde">
              <h3 className="text-xs font-bold uppercase text-texto-secundario tracking-wider mb-2">Descripción del Producto</h3>
              <p className="text-texto-secundario text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* 7. Quantity & 8. Add to Cart Button */}
          <div className="space-y-4 pt-4 border-t border-borde">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-texto-principal">Cantidad:</span>
                <div className="flex items-center bg-fondo rounded-xl border border-borde overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-texto-principal hover:bg-salvia-light font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-extrabold text-texto-principal">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 text-texto-principal hover:bg-salvia-light font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isOutOfStock
                    ? 'bg-borde text-texto-secundario cursor-not-allowed'
                    : added
                    ? 'bg-salvia text-white'
                    : 'bg-verde-oscuro hover:bg-verde-oscuro-hover text-white active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>¡Añadido al Carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al Carrito</span>
                  </>
                )}
              </button>

              {added && (
                <button
                  onClick={onNavigateToCart}
                  className="py-3.5 px-6 rounded-xl bg-coral hover:bg-coral-hover text-white font-bold text-sm transition-colors shadow-sm"
                >
                  Ir al Carrito
                </button>
              )}
            </div>
          </div>

          {/* Guarantee Footer */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-borde text-xs text-texto-secundario">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-verde-oscuro shrink-0" />
              <span>Garantía oficial TechStore</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-coral shrink-0" />
              <span>Envío seguro nacional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
