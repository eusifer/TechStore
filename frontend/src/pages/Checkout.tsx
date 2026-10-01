import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { Order } from '../types';

interface CheckoutProps {
  onBackToCart: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBackToCart, onOrderCompleted }) => {
  const { cart, subtotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Por favor ingrese su nombre completo.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail)) {
      setError('Por favor ingrese un correo electrónico válido.');
      return;
    }
    if (!customerAddress.trim()) {
      setError('Por favor ingrese la dirección completa de envío.');
      return;
    }
    if (cart.length === 0) {
      setError('El carrito está vacío. Agregue productos antes de continuar.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_address: customerAddress.trim(),
        items: cart.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity
        }))
      };

      const createdOrder = await createOrder(payload);
      clearCart();
      onOrderCompleted(createdOrder);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado al procesar el pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = "w-full bg-white border border-[#DCE4DC] text-[#26352A] placeholder:text-[#6B756D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:text-[#26352A] focus:border-[#5F7A61] focus:ring-1 focus:ring-[#5F7A61] font-medium transition-colors";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-superficie hover:bg-salvia-light text-texto-principal text-xs font-bold border border-borde transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 text-verde-oscuro" />
        <span>Volver al Carrito</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Form Column */}
        <div className="md:col-span-3 bg-superficie border border-borde rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-texto-principal tracking-tight">Datos del Comprador</h1>
            <p className="text-xs text-texto-secundario mt-1">
              Ingrese la información necesaria para registrar y entregar su pedido.
            </p>
          </div>

          {error && (
            <div className="bg-coral-light border border-coral text-coral-700 text-xs p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-coral shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Error en la solicitud</p>
                <p className="text-texto-principal">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-xs font-bold text-texto-principal mb-1">
                Nombre y Apellidos *
              </label>
              <input
                id="customerName"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-xs font-bold text-texto-principal mb-1">
                Correo Electrónico *
              </label>
              <input
                id="customerEmail"
                type="email"
                placeholder="Ej. juan.perez@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="customerAddress" className="block text-xs font-bold text-texto-principal mb-1">
                Dirección de Entrega *
              </label>
              <textarea
                id="customerAddress"
                rows={3}
                placeholder="Calle, número, departamento, ciudad y código postal"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
                className={inputStyle}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-xl bg-verde-oscuro hover:bg-verde-oscuro-hover text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Registrando Pedido en Base de Datos...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirmar y Registrar Pedido</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Order Summary Column */}
        <div className="md:col-span-2 bg-superficie border border-borde rounded-3xl p-6 h-fit space-y-4 shadow-sm">
          <h2 className="text-base font-extrabold text-texto-principal border-b border-borde pb-3">
            Detalle del Pedido
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-center text-xs">
                <div>
                  <p className="text-texto-principal font-bold line-clamp-1">{product.name}</p>
                  <span className="text-texto-secundario">{quantity}x S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <span className="text-texto-principal font-extrabold">
                  S/ {(product.price * quantity).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-borde pt-3 space-y-2">
            <div className="flex justify-between text-xs text-texto-secundario">
              <span>Subtotal</span>
              <span className="font-bold text-texto-principal">S/ {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-texto-secundario">
              <span>Envío Nacional</span>
              <span className="text-verde-oscuro font-bold">Gratis</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-texto-principal pt-2 border-t border-borde">
              <span>Total a pagar</span>
              <span className="text-verde-oscuro">S/ {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-texto-secundario pt-2 border-t border-borde">
            <ShieldCheck className="w-4 h-4 text-verde-oscuro shrink-0" />
            <span>Validación de stock e inventario en tiempo real</span>
          </div>
        </div>
      </div>
    </div>
  );
};
