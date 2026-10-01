import React, { useState } from 'react';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState(product.image_url || FALLBACK_IMAGE);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1200);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="bg-superficie border border-borde rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Product Image & Badges */}
      <div 
        className="relative aspect-video sm:aspect-square bg-fondo overflow-hidden cursor-pointer"
        onClick={() => onViewDetail(product)}
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-superficie text-texto-principal border border-borde text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Stock Badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
            isOutOfStock
              ? 'bg-coral text-white'
              : product.stock < 5
              ? 'bg-amarillo-light text-texto-principal border border-amarillo'
              : 'bg-salvia-light text-verde-oscuro border border-salvia'
          }`}
        >
          {isOutOfStock ? 'Agotado' : product.stock < 5 ? `¡Últimas ${product.stock}!` : `Stock: ${product.stock}`}
        </span>

        {/* Quick view overlay button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(product);
          }}
          className="absolute inset-0 m-auto w-10 h-10 bg-verde-oscuro text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-md"
          aria-label={`Ver detalles de ${product.name}`}
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onViewDetail(product)}
            className="text-texto-principal font-bold text-base hover:text-salvia cursor-pointer transition-colors line-clamp-1 mb-1"
          >
            {product.name}
          </h3>
          <p className="text-texto-secundario text-xs line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-borde mt-auto">
          <div>
            <span className="text-[11px] text-texto-secundario block font-medium uppercase tracking-wider">Precio</span>
            <span className="text-lg font-extrabold text-texto-principal tracking-tight">
              S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-salvia ${
              isOutOfStock
                ? 'bg-borde text-texto-secundario cursor-not-allowed shadow-none'
                : addedAnimation
                ? 'bg-salvia text-white scale-105'
                : 'bg-verde-oscuro hover:bg-verde-oscuro-hover text-white active:scale-95'
            }`}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Añadido</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
