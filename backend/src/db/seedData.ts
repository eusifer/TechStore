import { Product } from '../types';

export const INITIAL_PRODUCTS: Omit<Product, 'id' | 'created_at'>[] = [
  {
    name: 'Laptop Gamer Pro X15',
    description: 'Laptop de alto rendimiento con Intel Core i7 13ª gen, 16GB RAM DDR5, 1TB SSD NVMe, NVIDIA RTX 4060.',
    price: 1299.99,
    stock: 12,
    category: 'Laptops',
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ultrabook ZenBook Slim 14',
    description: 'Laptop ultraportátil con pantalla OLED 2.8K, AMD Ryzen 7, 16GB RAM y batería de 14 horas.',
    price: 999.50,
    stock: 8,
    category: 'Laptops',
    image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Monitor Gaming Curved 27" 165Hz',
    description: 'Monitor curvo Quad HD 1440p de 27 pulgadas, tasa de refresco 165Hz, 1ms tiempo de respuesta, HDR400.',
    price: 349.99,
    stock: 15,
    category: 'Monitores',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Monitor Profesional 4K 32" IPS',
    description: 'Monitor 4K UHD para diseño gráfico y edición con 99% sRGB, calibración de fábrica y puertos USB-C Hub.',
    price: 589.00,
    stock: 5,
    category: 'Monitores',
    image_url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Teclado Mecánico RGB Switch Red',
    description: 'Teclado mecánico gamer completo con switches rojos lineales, retroiluminación RGB por tecla y chasis de aluminio.',
    price: 89.99,
    stock: 25,
    category: 'Teclados',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Teclado Inalámbrico Ergológico Slim',
    description: 'Teclado compacto Bluetooth multitrazado ultrasilencioso con diseño ergonómico y batería recargable.',
    price: 64.50,
    stock: 20,
    category: 'Teclados',
    image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Mouse Gamer Inalámbrico 26K DPI',
    description: 'Mouse inalámbrico ultraligero de 63g con sensor óptico de 26,000 DPI y 80 horas de autonomía.',
    price: 79.99,
    stock: 30,
    category: 'Mouse',
    image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Mouse Ergonómico Vertical Wireless',
    description: 'Mouse diseñado para prevenir el síndrome de túnel carpiano con postura natural de sujeción.',
    price: 45.00,
    stock: 18,
    category: 'Mouse',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Auriculares Wireless Noise Cancelling',
    description: 'Auriculares Over-Ear con cancelación activa de ruido (ANC), audio de alta resolución y 35 horas de batería.',
    price: 199.99,
    stock: 14,
    category: 'Auriculares',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Auriculares Gamer 7.1 Surround',
    description: 'Headset para juegos con sonido envolvente 7.1, micrófono con cancelación de ruido y almohadillas viscoelásticas.',
    price: 85.00,
    stock: 22,
    category: 'Auriculares',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Impresora Multifuncional WiFi Ecofit',
    description: 'Impresora fotográfica a color con tanque de tinta continuo, escáner, copias y conectividad WiFi Direct.',
    price: 229.00,
    stock: 7,
    category: 'Impresoras',
    image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Impresora Láser Monocromática Compacta',
    description: 'Impresora de alta velocidad (30 ppm), impresión dúplex automática e ideal para oficina pequeña o hogar.',
    price: 149.99,
    stock: 10,
    category: 'Impresoras',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Docking Station USB-C Dual 4K',
    description: 'Estación de acoplamiento USB-C con salida de doble pantalla 4K, Power Delivery de 100W, Ethernet y 6 puertos USB.',
    price: 119.50,
    stock: 16,
    category: 'Accesorios',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Webcam Full HD 1080p con Micrófono',
    description: 'Cámara web con enfoque automático, corrección de luz en penumbra y micrófono estéreo omnidireccional.',
    price: 49.99,
    stock: 40,
    category: 'Accesorios',
    image_url: 'https://images.unsplash.com/photo-1585858229735-cd08d8cb510d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Soporte de Aluminio Regulable para Laptop',
    description: 'Soporte ergonómico plegable de aleación de aluminio para laptops de 10 a 17.3 pulgadas con diseño de disipación de calor.',
    price: 29.99,
    stock: 50,
    category: 'Accesorios',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Disco Duro Externo SSD 1TB NVMe',
    description: 'Unidad de estado sólido portátil de 1050 MB/s, resistente a caídas y agua con interfaz USB 3.2 Gen 2.',
    price: 109.99,
    stock: 25,
    category: 'Accesorios',
    image_url: 'https://images.unsplash.com/photo-1597872250970-45d2e0573e65?auto=format&fit=crop&w=800&q=80'
  }
];
