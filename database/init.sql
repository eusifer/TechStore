-- TechStore PostgreSQL Initialization Script
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

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Initial 16 seed products
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Laptop Gamer Pro X15', 'Laptop de alto rendimiento con Intel Core i7 13ª gen, 16GB RAM DDR5, 1TB SSD NVMe, NVIDIA RTX 4060.', 1299.99, 12, 'Laptops', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'),
('Ultrabook ZenBook Slim 14', 'Laptop ultraportátil con pantalla OLED 2.8K, AMD Ryzen 7, 16GB RAM y batería de 14 horas.', 999.50, 8, 'Laptops', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'),
('Monitor Gaming Curved 27" 165Hz', 'Monitor curvo Quad HD 1440p de 27 pulgadas, tasa de refresco 165Hz, 1ms tiempo de respuesta, HDR400.', 349.99, 15, 'Monitores', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'),
('Monitor Profesional 4K 32" IPS', 'Monitor 4K UHD para diseño gráfico y edición con 99% sRGB, calibración de fábrica y puertos USB-C Hub.', 589.00, 5, 'Monitores', 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80'),
('Teclado Mecánico RGB Switch Red', 'Teclado mecánico gamer completo con switches rojos lineales, retroiluminación RGB por tecla y chasis de aluminio.', 89.99, 25, 'Teclados', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'),
('Teclado Inalámbrico Ergológico Slim', 'Teclado compacto Bluetooth multitrazado ultrasilencioso con diseño ergonómico y batería recargable.', 64.50, 20, 'Teclados', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80'),
('Mouse Gamer Inalámbrico 26K DPI', 'Mouse inalámbrico ultraligero de 63g con sensor óptico de 26,000 DPI y 80 horas de autonomía.', 79.99, 30, 'Mouse', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'),
('Mouse Ergonómico Vertical Wireless', 'Mouse diseñado para prevenir el síndrome de túnel carpiano con postura natural de sujeción.', 45.00, 18, 'Mouse', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'),
('Auriculares Wireless Noise Cancelling', 'Auriculares Over-Ear con cancelación activa de ruido (ANC), audio de alta resolución y 35 horas de batería.', 199.99, 14, 'Auriculares', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'),
('Auriculares Gamer 7.1 Surround', 'Headset para juegos con sonido envolvente 7.1, micrófono con cancelación de ruido y almohadillas viscoelásticas.', 85.00, 22, 'Auriculares', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'),
('Impresora Multifuncional WiFi Ecofit', 'Impresora fotográfica a color con tanque de tinta continuo, escáner, copias y conectividad WiFi Direct.', 229.00, 7, 'Impresoras', 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80'),
('Impresora Láser Monocromática Compacta', 'Impresora de alta velocidad (30 ppm), impresión dúplex automática e ideal para oficina pequeña o hogar.', 149.99, 10, 'Impresoras', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'),
('Docking Station USB-C Dual 4K', 'Estación de acoplamiento USB-C con salida de doble pantalla 4K, Power Delivery de 100W, Ethernet y 6 puertos USB.', 119.50, 16, 'Accesorios', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'),
('Webcam Full HD 1080p con Micrófono', 'Cámara web con enfoque automático, corrección de luz en penumbra y micrófono estéreo omnidireccional.', 49.99, 40, 'Accesorios', 'https://images.unsplash.com/photo-1585858229735-cd08d8cb510d?auto=format&fit=crop&w=800&q=80'),
('Soporte de Aluminio Regulable para Laptop', 'Soporte ergonómico plegable de aleación de aluminio para laptops de 10 a 17.3 pulgadas con diseño de disipación de calor.', 29.99, 50, 'Accesorios', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'),
('Disco Duro Externo SSD 1TB NVMe', 'Unidad de estado sólido portátil de 1050 MB/s, resistente a caídas y agua con interfaz USB 3.2 Gen 2.', 109.99, 25, 'Accesorios', 'https://images.unsplash.com/photo-1597872250970-45d2e0573e65?auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;
