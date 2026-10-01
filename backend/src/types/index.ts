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

export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: OrderItemInput[];
}

export interface OrderItemResponse {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_name?: string;
}

export interface OrderResponse {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  total: number;
  status: string;
  created_at: string;
  items?: OrderItemResponse[];
}

export interface AuditEvent {
  event: 'PRODUCT_VIEWED' | 'ORDER_CREATED' | 'ORDER_FAILED';
  timestamp: Date;
  metadata: Record<string, any>;
}
