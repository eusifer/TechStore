import React from 'react';
import { CheckCircle2, ShoppingBag, Calendar, Mail, MapPin, User, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onContinueShopping }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Confirmation Header Banner */}
      <div className="bg-superficie border border-borde rounded-3xl p-8 text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="w-16 h-16 bg-salvia-light text-verde-oscuro border border-salvia/40 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs font-bold text-verde-oscuro uppercase tracking-widest">
            ¡Compra Registrada Exitosamente!
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-texto-principal mt-1">
            Pedido registrado correctamente
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario mt-2 max-w-md mx-auto">
            Hemos recibido tu orden y guardado la transacción en la base de datos PostgreSQL con evento de auditoría en MongoDB.
          </p>
        </div>
      </div>

      {/* Order Summary & Customer Info */}
      <div className="bg-superficie border border-borde rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borde pb-6">
          <div>
            <span className="text-xs text-texto-secundario font-bold uppercase tracking-wider">Número de Pedido</span>
            <h2 className="text-xl font-extrabold text-verde-oscuro">#{order.id}</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-texto-principal bg-fondo px-3.5 py-1.5 rounded-xl border border-borde font-semibold">
            <Calendar className="w-4 h-4 text-verde-oscuro" />
            <span>{new Date(order.created_at).toLocaleString('es-ES')}</span>
          </div>
        </div>

        {/* Customer Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-fondo p-4 rounded-2xl border border-borde">
          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-verde-oscuro shrink-0 mt-0.5" />
            <div>
              <span className="text-texto-secundario font-bold block">Cliente</span>
              <span className="text-texto-principal font-bold">{order.customer_name}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-verde-oscuro shrink-0 mt-0.5" />
            <div>
              <span className="text-texto-secundario font-bold block">Correo Electrónico</span>
              <span className="text-texto-principal font-bold">{order.customer_email}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-verde-oscuro shrink-0 mt-0.5" />
            <div>
              <span className="text-texto-secundario font-bold block">Dirección de Envío</span>
              <span className="text-texto-principal font-bold">{order.customer_address}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-texto-principal uppercase tracking-wider">Productos Adquiridos</h3>
          <div className="divide-y divide-borde">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-texto-principal font-bold">{item.product_name || `Producto #${item.product_id}`}</span>
                  <p className="text-texto-secundario">{item.quantity} x S/ {item.unit_price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <span className="text-texto-principal font-extrabold text-sm">
                  S/ {item.subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-borde pt-4 flex justify-between items-center text-base font-extrabold text-texto-principal">
            <span>Total Pagado</span>
            <span className="text-xl text-verde-oscuro">
              S/ {order.total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-borde flex justify-center">
          <button
            onClick={onContinueShopping}
            className="px-6 py-3.5 rounded-xl bg-verde-oscuro hover:bg-verde-oscuro-hover text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Seguir Comprando</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
