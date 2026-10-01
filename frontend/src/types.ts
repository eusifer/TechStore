export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_name?: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  total: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface HealthResponse {
  status: string;
  service: string;
  postgres: string;
  mongodb: string;
  timestamp: string;
}

export interface AuditLog {
  _id?: string;
  event: string;
  timestamp: string;
  metadata: Record<string, any>;
}
