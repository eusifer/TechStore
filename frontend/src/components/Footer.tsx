import React from 'react';
import { Cpu, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-verde-oscuro border-t border-verde-oscuro/40 text-white mt-16">
      {/* Features Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-verde-oscuro-hover text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <Truck className="w-7 h-7 text-amarillo shrink-0" />
          <div>
            <h4 className="text-white font-bold text-sm">Envío Rápido y Garantizado</h4>
            <p className="text-xs text-white/80">Entregas nacionales express en 24/48 horas</p>
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <ShieldCheck className="w-7 h-7 text-verde-claro shrink-0" />
          <div>
            <h4 className="text-white font-bold text-sm">Garantía Directa</h4>
            <p className="text-xs text-white/80">12 meses de garantía oficial en todos los equipos</p>
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <RefreshCw className="w-7 h-7 text-coral shrink-0" />
          <div>
            <h4 className="text-white font-bold text-sm">Soporte Técnico Especializado</h4>
            <p className="text-xs text-white/80">Atención humana y profesional para tu compra</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/80">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amarillo" />
          <span className="font-semibold text-white">TechStore Academic Platform</span>
          <span>&copy; {new Date().getFullYear()} Todos los derechos reservados.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-oscuro-hover text-white text-xs font-medium border border-salvia">
            <span className="w-2 h-2 rounded-full bg-amarillo animate-pulse"></span>
            Sistema en Línea (PostgreSQL + MongoDB)
          </span>
        </div>
      </div>
    </footer>
  );
};
