import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import { getProducts, getProductById, getCategories } from '../controllers/productsController';
import { createOrder, getOrders } from '../controllers/ordersController';
import { getMetrics, getAuditLogs } from '../controllers/metricsController';

const router = Router();

// Health
router.get('/health', getHealth);

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/categories', getCategories);

// Orders
router.post('/orders', createOrder);
router.get('/orders', getOrders);

// Audit & Metrics
router.get('/audit-logs', getAuditLogs);
router.get('/metrics', getMetrics);

export default router;
