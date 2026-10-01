import { Request, Response, NextFunction } from 'express';
import { createOrderDb, getOrdersDb } from '../db/postgres';
import { logAuditEvent } from '../db/mongodb';
import { ordersCreatedCounter, orderErrorsCounter } from '../middleware/metricsMiddleware';
import { CreateOrderRequest } from '../types';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  const { customer_name, customer_email, customer_address, items }: CreateOrderRequest = req.body;

  // Validation
  if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length === 0) {
    orderErrorsCounter.inc();
    await logAuditEvent('ORDER_FAILED', { reason: 'Nombre de cliente inválido', payload: req.body });
    return res.status(400).json({ error: true, message: 'El nombre del cliente es obligatorio.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer_email || !emailRegex.test(customer_email)) {
    orderErrorsCounter.inc();
    await logAuditEvent('ORDER_FAILED', { reason: 'Email inválido', customer_email });
    return res.status(400).json({ error: true, message: 'Se requiere un correo electrónico válido.' });
  }

  if (!customer_address || typeof customer_address !== 'string' || customer_address.trim().length === 0) {
    orderErrorsCounter.inc();
    await logAuditEvent('ORDER_FAILED', { reason: 'Dirección inválida', customer_address });
    return res.status(400).json({ error: true, message: 'La dirección de envío es obligatoria.' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    orderErrorsCounter.inc();
    await logAuditEvent('ORDER_FAILED', { reason: 'Carrito vacío', items });
    return res.status(400).json({ error: true, message: 'El pedido debe contener al menos un producto.' });
  }

  for (const item of items) {
    if (!item.product_id || typeof item.product_id !== 'number' || !item.quantity || item.quantity <= 0) {
      orderErrorsCounter.inc();
      await logAuditEvent('ORDER_FAILED', { reason: 'Item con formato inválido', item });
      return res.status(400).json({ error: true, message: 'Formato de items del pedido inválido.' });
    }
  }

  try {
    const newOrder = await createOrderDb({
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim(),
      customer_address: customer_address.trim(),
      items
    });

    ordersCreatedCounter.inc();
    await logAuditEvent('ORDER_CREATED', {
      order_id: newOrder.id,
      customer_name: newOrder.customer_name,
      customer_email: newOrder.customer_email,
      total: newOrder.total,
      item_count: newOrder.items?.length || 0
    });

    res.status(201).json({
      message: 'Pedido registrado correctamente',
      order: newOrder
    });
  } catch (error: any) {
    orderErrorsCounter.inc();
    await logAuditEvent('ORDER_FAILED', {
      reason: error.message || 'Error en transacción de orden',
      customer_email
    });

    res.status(400).json({
      error: true,
      message: error.message || 'Error al procesar el pedido.'
    });
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await getOrdersDb();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}
