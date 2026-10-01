import React from 'react';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onNavigateToCheckout: () => void;
  onNavigateToProducts: () => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigateToCheckout, onNavigateToProducts }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-superficie rounded-full flex items-center justify-center mx-auto text-verde-oscuro border border-borde shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-texto-principal">Tu carrito está vacío</h2>
          <p className="text-texto-secundario text-sm">
            Explora nuestro catálogo tecnológico y añade tus productos preferidos.
          </p>
        </div>
        <button
          onClick={onNavigateToProducts}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-verde-oscuro hover:bg-verde-oscuro-hover text-white font-bold text-sm shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explorar Catálogo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-texto-principal tracking-tight">
            Carrito de Compras
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario mt-0.5">
            Revisa tus artículos antes de completar tu pedido ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-coral hover:text-coral-hover font-bold flex items-center gap-1 hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vaciar Carrito</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-superficie border border-borde rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-all hover:border-salvia"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl bg-fondo border border-borde shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-verde-oscuro uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-texto-principal font-bold text-sm line-clamp-1">{product.name}</h3>
                  <span className="text-xs text-texto-secundario font-medium">
                    S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-borde">
                <div className="flex items-center bg-fondo rounded-xl border border-borde">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 text-texto-principal hover:bg-salvia-light rounded-l-xl transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-texto-principal">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1.5 text-texto-principal hover:bg-salvia-light rounded-r-xl transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-texto-secundario uppercase font-semibold block">Subtotal</span>
                  <span className="text-sm font-extrabold text-texto-principal">
                    S/ {(product.price * quantity).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-texto-secundario hover:text-coral hover:bg-coral-light rounded-lg transition-colors"
                  aria-label="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="bg-superficie border border-borde rounded-3xl p-6 h-fit space-y-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-texto-principal border-b border-borde pb-3">
            Resumen de la Compra
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-texto-secundario">
              <span>Subtotal ({totalItems} ítems)</span>
              <span className="font-bold text-texto-principal">S/ {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-texto-secundario">
              <span>Envío Nacional Express</span>
              <span className="text-verde-oscuro font-bold">GRATIS</span>
            </div>
            <div className="flex justify-between text-texto-secundario">
              <span>Impuestos (Incluidos)</span>
              <span>S/ 0.00</span>
            </div>
            <div className="border-t border-borde pt-3 flex justify-between text-base font-extrabold text-texto-principal">
              <span>Total a pagar</span>
              <span className="text-xl text-verde-oscuro">
                S/ {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateToCheckout}
            className="w-full py-4 px-6 rounded-xl bg-verde-oscuro hover:bg-verde-oscuro-hover text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95"
          >
            <span>Proceder al Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
