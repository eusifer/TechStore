import { Pool } from 'pg';
import { INITIAL_PRODUCTS } from './seedData';
import { Product, OrderResponse, OrderItemResponse, CreateOrderRequest } from '../types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://techuser:techpass@localhost:5432/techstoredb',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'techuser',
  password: process.env.POSTGRES_PASSWORD || 'techpass',
  database: process.env.POSTGRES_DB || 'techstoredb',
  connectionTimeoutMillis: 3000,
});

let isPgConnected = false;
let memoryProducts: Product[] = [];
let memoryOrders: OrderResponse[] = [];
let memoryOrderSeq = 1000;

export const getPgStatus = () => isPgConnected;

export async function initDb(): Promise<void> {
  // Initialize in-memory products as default fallback
  memoryProducts = INITIAL_PRODUCTS.map((p, idx) => ({
    ...p,
    id: idx + 1,
    created_at: new Date().toISOString()
  }));

  try {
    const client = await pool.connect();
    await client.query("SET client_encoding = 'UTF8';");
    console.log('PostgreSQL connection established successfully.');
    isPgConnected = true;

    // Create tables if they do not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        category VARCHAR(100) NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_address TEXT NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT REFERENCES products(id),
        quantity INT NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL
      );
    `);

    // Check if products table is empty, if so insert seed data
    const res = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count, 10) === 0) {
      console.log('Seeding initial products into PostgreSQL...');
      for (const p of INITIAL_PRODUCTS) {
        await client.query(
          `INSERT INTO products (name, description, price, stock, category, image_url)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [p.name, p.description, p.price, p.stock, p.category, p.image_url]
        );
      }
      console.log('PostgreSQL database seeded successfully.');
    } else {
      // Ensure existing records are correctly UTF-8 encoded
      const checkRes = await client.query("SELECT id, name, description FROM products WHERE name LIKE '%Â%' OR name LIKE '%Ã%' OR description LIKE '%Â%' OR description LIKE '%Ã%'");
      if (checkRes.rows.length > 0) {
        console.log('Fixing legacy double-encoded UTF-8 strings in PostgreSQL products table...');
        for (const p of INITIAL_PRODUCTS) {
          const matchingRow = checkRes.rows.find(r => r.id === (p as any).id);
          if (matchingRow || checkRes.rows.length > 0) {
            await client.query(
              `UPDATE products SET name = $1, description = $2, category = $3 WHERE name = $4 OR description LIKE $5 OR category = $6`,
              [p.name, p.description, p.category, p.name, `%${p.name.substring(0, 10)}%`, p.category]
            );
          }
        }
      }
    }

    client.release();
  } catch (err: any) {
    console.warn(`PostgreSQL connection warning (${err.message}). Operating in dual-mode (fallback to memory if needed).`);
    isPgConnected = false;
  }
}

export async function getProductsDb(search?: string, category?: string): Promise<Product[]> {
  if (isPgConnected) {
    try {
      let query = 'SELECT * FROM products WHERE 1=1';
      const values: any[] = [];

      if (search) {
        values.push(`%${search}%`);
        query += ` AND (LOWER(name) LIKE LOWER($${values.length}) OR LOWER(description) LIKE LOWER($${values.length}))`;
      }

      if (category && category.toLowerCase() !== 'todas' && category.toLowerCase() !== 'all') {
        values.push(category);
        query += ` AND category = $${values.length}`;
      }

      query += ' ORDER BY id ASC';
      const result = await pool.query(query, values);
      return result.rows.map(r => ({
        ...r,
        price: parseFloat(r.price)
      }));
    } catch (e) {
      console.error('Error fetching products from PostgreSQL, falling back to memory:', e);
    }
  }

  // Memory fallback filtering
  let filtered = [...memoryProducts];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (category && category.toLowerCase() !== 'todas' && category.toLowerCase() !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return filtered;
}

export async function getProductByIdDb(id: number): Promise<Product | null> {
  if (isPgConnected) {
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return { ...row, price: parseFloat(row.price) };
      }
      return null;
    } catch (e) {
      console.error('Error fetching product by ID from PostgreSQL:', e);
    }
  }
  return memoryProducts.find(p => p.id === id) || null;
}

export async function createOrderDb(orderData: CreateOrderRequest): Promise<OrderResponse> {
  if (isPgConnected) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Validate items & calculate total
      let calculatedTotal = 0;
      const verifiedItems: { product: Product; quantity: number; subtotal: number }[] = [];

      for (const item of orderData.items) {
        const res = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.product_id]);
        if (res.rows.length === 0) {
          throw new Error(`Producto con ID ${item.product_id} no existe.`);
        }
        const prod = res.rows[0];
        const price = parseFloat(prod.price);
        if (prod.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto "${prod.name}". Disponible: ${prod.stock}, solicitado: ${item.quantity}`);
        }
        const subtotal = price * item.quantity;
        calculatedTotal += subtotal;
        verifiedItems.push({
          product: { ...prod, price },
          quantity: item.quantity,
          subtotal
        });
      }

      // 2. Insert order
      const orderRes = await client.query(
        `INSERT INTO orders (customer_name, customer_email, customer_address, total, status)
         VALUES ($1, $2, $3, $4, 'COMPLETED') RETURNING *`,
        [orderData.customer_name, orderData.customer_email, orderData.customer_address, calculatedTotal]
      );
      const newOrder = orderRes.rows[0];

      // 3. Insert order items & update stock
      const orderItems: OrderItemResponse[] = [];
      for (const item of verifiedItems) {
        const itemRes = await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [newOrder.id, item.product.id, item.quantity, item.product.price, item.subtotal]
        );

        await client.query(
          `UPDATE products SET stock = stock - $1 WHERE id = $2`,
          [item.quantity, item.product.id]
        );

        orderItems.push({
          ...itemRes.rows[0],
          unit_price: parseFloat(itemRes.rows[0].unit_price),
          subtotal: parseFloat(itemRes.rows[0].subtotal),
          product_name: item.product.name
        });
      }

      await client.query('COMMIT');
      client.release();

      return {
        id: newOrder.id,
        customer_name: newOrder.customer_name,
        customer_email: newOrder.customer_email,
        customer_address: newOrder.customer_address,
        total: parseFloat(newOrder.total),
        status: newOrder.status,
        created_at: newOrder.created_at,
        items: orderItems
      };
    } catch (err) {
      await client.query('ROLLBACK');
      client.release();
      throw err;
    }
  }

  // Fallback memory transaction
  let calculatedTotal = 0;
  const verifiedItems: { product: Product; quantity: number; subtotal: number }[] = [];

  for (const item of orderData.items) {
    const prod = memoryProducts.find(p => p.id === item.product_id);
    if (!prod) {
      throw new Error(`Producto con ID ${item.product_id} no existe.`);
    }
    if (prod.stock < item.quantity) {
      throw new Error(`Stock insuficiente para el producto "${prod.name}". Disponible: ${prod.stock}, solicitado: ${item.quantity}`);
    }
    const subtotal = prod.price * item.quantity;
    calculatedTotal += subtotal;
    verifiedItems.push({ product: prod, quantity: item.quantity, subtotal });
  }

  // Update stock
  for (const v of verifiedItems) {
    v.product.stock -= v.quantity;
  }

  memoryOrderSeq++;
  const orderId = memoryOrderSeq;
  const createdItems: OrderItemResponse[] = verifiedItems.map((v, idx) => ({
    id: idx + 1,
    order_id: orderId,
    product_id: v.product.id,
    quantity: v.quantity,
    unit_price: v.product.price,
    subtotal: v.subtotal,
    product_name: v.product.name
  }));

  const createdOrder: OrderResponse = {
    id: orderId,
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_address: orderData.customer_address,
    total: Math.round(calculatedTotal * 100) / 100,
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
    items: createdItems
  };

  memoryOrders.unshift(createdOrder);
  return createdOrder;
}

export async function getOrdersDb(): Promise<OrderResponse[]> {
  if (isPgConnected) {
    try {
      const ordersRes = await pool.query('SELECT * FROM orders ORDER BY id DESC LIMIT 50');
      const orders: OrderResponse[] = [];

      for (const row of ordersRes.rows) {
        const itemsRes = await pool.query(
          `SELECT oi.*, p.name as product_name 
           FROM order_items oi 
           LEFT JOIN products p ON oi.product_id = p.id 
           WHERE oi.order_id = $1`,
          [row.id]
        );
        orders.push({
          id: row.id,
          customer_name: row.customer_name,
          customer_email: row.customer_email,
          customer_address: row.customer_address,
          total: parseFloat(row.total),
          status: row.status,
          created_at: row.created_at,
          items: itemsRes.rows.map(i => ({
            id: i.id,
            order_id: i.order_id,
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: parseFloat(i.unit_price),
            subtotal: parseFloat(i.subtotal),
            product_name: i.product_name
          }))
        });
      }
      return orders;
    } catch (e) {
      console.error('Error fetching orders from PostgreSQL:', e);
    }
  }

  return memoryOrders;
}

export async function getCategoriesDb(): Promise<string[]> {
  if (isPgConnected) {
    try {
      const res = await pool.query('SELECT DISTINCT category FROM products ORDER BY category ASC');
      return res.rows.map(r => r.category);
    } catch (e) {
      console.error('Error fetching categories from PostgreSQL:', e);
    }
  }
  const cats = Array.from(new Set(memoryProducts.map(p => p.category)));
  return cats.sort();
}
