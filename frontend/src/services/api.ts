import { Product, CreateOrderPayload, Order, HealthResponse, AuditLog } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export async function fetchProducts(search?: string, category?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'Todas') params.append('category', category);

  const url = `${API_BASE}/products${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Error al cargar la lista de productos.');
  }
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('El producto solicitado no existe.');
    }
    throw new Error('Error al obtener los detalles del producto.');
  }
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) {
    return ['Laptops', 'Monitores', 'Teclados', 'Mouse', 'Auriculares', 'Impresoras', 'Accesorios'];
  }
  return res.json();
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'No se pudo registrar el pedido.');
  }
  return data.order;
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) {
    throw new Error('Error al obtener el historial de pedidos.');
  }
  return res.json();
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error('El servidor backend no responde.');
  }
  return res.json();
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/audit-logs`);
  if (!res.ok) {
    return [];
  }
  return res.json();
}
