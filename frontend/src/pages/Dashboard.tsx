import React, { useEffect, useState } from 'react';
import { Activity, Database, ShieldAlert, BarChart3, RefreshCw } from 'lucide-react';
import { fetchHealth, fetchAuditLogs, fetchOrders } from '../services/api';
import { HealthResponse, AuditLog, Order } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetchHealth().catch(() => null),
      fetchAuditLogs().catch(() => []),
      fetchOrders().catch(() => [])
    ]).then(([healthRes, auditRes, ordersRes]) => {
      setHealth(healthRes);
      setAuditLogs(auditRes);
      setOrders(ordersRes);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-superficie border border-borde rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-verde-oscuro" />
            <h1 className="text-2xl font-extrabold text-texto-principal tracking-tight">
              Panel de Observabilidad y Auditoría
            </h1>
          </div>
          <p className="text-xs text-texto-secundario mt-1">
            Monitoreo en tiempo real de servicios, persistencia en PostgreSQL, auditoría en MongoDB y métricas de Prometheus.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-fondo hover:bg-salvia-light text-texto-principal text-xs font-bold border border-borde transition-colors w-fit shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-verde-oscuro" />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Consultando estado del backend, PostgreSQL y MongoDB..." />
      ) : (
        <>
          {/* Health Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-superficie border border-borde rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-salvia-light text-verde-oscuro flex items-center justify-center border border-salvia/30">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-texto-secundario font-bold block">REST API Status</span>
                  <span className="text-sm font-extrabold text-texto-principal uppercase">{health?.service || 'techstore-api'}</span>
                </div>
              </div>
              <span className="w-3.5 h-3.5 rounded-full bg-verde-oscuro" />
            </div>

            <div className="bg-superficie border border-borde rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-salvia-light text-verde-oscuro flex items-center justify-center border border-salvia/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-texto-secundario font-bold block">PostgreSQL DB</span>
                  <span className="text-sm font-extrabold text-texto-principal capitalize">
                    {health?.postgres === 'connected' ? 'Conectado' : 'FallBack Activo'}
                  </span>
                </div>
              </div>
              <span className={`w-3.5 h-3.5 rounded-full ${health?.postgres === 'connected' ? 'bg-verde-oscuro' : 'bg-amarillo'}`} />
            </div>

            <div className="bg-superficie border border-borde rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-salvia-light text-verde-oscuro flex items-center justify-center border border-salvia/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-texto-secundario font-bold block">MongoDB Auditoría</span>
                  <span className="text-sm font-extrabold text-texto-principal capitalize">
                    {health?.mongodb === 'connected' ? 'Conectado' : 'Fallback Activo'}
                  </span>
                </div>
              </div>
              <span className={`w-3.5 h-3.5 rounded-full ${health?.mongodb === 'connected' ? 'bg-verde-oscuro' : 'bg-amarillo'}`} />
            </div>
          </div>

          {/* Direct Prometheus Link Bar */}
          <div className="bg-superficie border border-borde rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-verde-oscuro shrink-0" />
              <div>
                <p className="text-texto-principal font-bold text-sm">Endpoint de Métricas Prometheus</p>
                <p className="text-xs text-texto-secundario">Exponiendo contadores de solicitudes HTTP, latencia y transacciones</p>
              </div>
            </div>
            <a
              href="/metrics"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-verde-oscuro text-white hover:bg-verde-oscuro-hover text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
            >
              Abrir /metrics Raw
            </a>
          </div>

          {/* Grid of Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* MongoDB Audit Log Table */}
            <div className="bg-superficie border border-borde rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-borde pb-3">
                <h2 className="text-base font-extrabold text-texto-principal flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-verde-oscuro" />
                  Eventos de Auditoría (MongoDB)
                </h2>
                <span className="text-xs text-texto-secundario font-semibold">{auditLogs.length} eventos</span>
              </div>

              {auditLogs.length === 0 ? (
                <p className="text-xs text-texto-secundario text-center py-6">No hay eventos de auditoría registrados aún.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {auditLogs.map((log, idx) => (
                    <div key={log._id || idx} className="bg-fondo p-3 rounded-xl border border-borde text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          log.event === 'ORDER_CREATED' ? 'bg-salvia-light text-verde-oscuro border border-salvia/40' :
                          log.event === 'ORDER_FAILED' ? 'bg-coral-light text-coral border border-coral/40' :
                          'bg-superficie text-texto-principal border border-borde'
                        }`}>
                          {log.event}
                        </span>
                        <span className="text-[10px] text-texto-secundario font-medium">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="text-[11px] text-texto-principal overflow-x-auto whitespace-pre-wrap font-mono pt-1 font-semibold">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PostgreSQL Orders Table */}
            <div className="bg-superficie border border-borde rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-borde pb-3">
                <h2 className="text-base font-extrabold text-texto-principal flex items-center gap-2">
                  <Database className="w-4 h-4 text-verde-oscuro" />
                  Historial de Pedidos (PostgreSQL)
                </h2>
                <span className="text-xs text-texto-secundario font-semibold">{orders.length} pedidos</span>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-texto-secundario text-center py-6">No hay pedidos registrados en la base de datos.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-fondo p-3.5 rounded-xl border border-borde text-xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-verde-oscuro">#{o.id}</span>
                          <span className="text-texto-principal font-bold">{o.customer_name}</span>
                        </div>
                        <p className="text-texto-secundario text-[11px]">{o.customer_email}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-texto-principal text-sm block">S/ {o.total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-[10px] text-verde-oscuro bg-salvia-light px-2 py-0.5 rounded font-bold border border-salvia/40">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
